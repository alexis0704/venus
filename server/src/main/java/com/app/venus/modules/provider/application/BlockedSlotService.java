package com.app.venus.modules.provider.application;

import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.app.venus.modules.order.infrastructure.OrderRepository;
import com.app.venus.modules.provider.domain.BlockReason;
import com.app.venus.modules.provider.domain.BlockedSlot;
import com.app.venus.modules.provider.domain.Station;
import com.app.venus.modules.provider.infrastructure.BlockedSlotRepository;
import com.app.venus.modules.provider.interfaces.dto.response.BlockedSlotResponse;
import com.app.venus.modules.user.application.DemoCurrentUserService;
import com.app.venus.shared.domain.OrderStatus;
import com.app.venus.shared.domain.PublicIdGenerator;
import com.app.venus.shared.exception.ConflictException;
import com.app.venus.shared.exception.NotFoundException;
import com.app.venus.shared.exception.UnprocessableEntityException;

@Service
public class BlockedSlotService {
    private static final Set<OrderStatus> BLOCKING_STATUSES = Set.of(
            OrderStatus.PENDING,
            OrderStatus.CONFIRMED,
            OrderStatus.ACTIVE);

    private final BlockedSlotRepository blockedSlotRepository;
    private final OrderRepository orderRepository;
    private final HostStationService hostStationService;
    private final DemoCurrentUserService currentUserService;
    private final PublicIdGenerator publicIdGenerator;

    public BlockedSlotService(
            BlockedSlotRepository blockedSlotRepository,
            OrderRepository orderRepository,
            HostStationService hostStationService,
            DemoCurrentUserService currentUserService,
            PublicIdGenerator publicIdGenerator) {
        this.blockedSlotRepository = blockedSlotRepository;
        this.orderRepository = orderRepository;
        this.hostStationService = hostStationService;
        this.currentUserService = currentUserService;
        this.publicIdGenerator = publicIdGenerator;
    }

    @Transactional
    public BlockedSlot createBlockedSlot(com.app.venus.modules.provider.interfaces.dto.request.CreateBlockedSlotRequest request) {
        if (!request.endTime().isAfter(request.startTime())) {
            throw new UnprocessableEntityException("End time must be after start time.");
        }
        Station station = hostStationService.getCurrentProviderStation();
        if (orderRepository.existsOverlappingStationOrder(
                station.getId(),
                request.startTime(),
                request.endTime(),
                BLOCKING_STATUSES)
                || blockedSlotRepository.existsOverlappingSlot(station.getId(), request.startTime(), request.endTime())) {
            throw new ConflictException("SLOT_CONFLICT", "The blocked window overlaps with an existing booking or blocked slot.");
        }
        BlockReason reason = parseReason(request.reason());
        return blockedSlotRepository.saveAndFlush(new BlockedSlot(
                publicIdGenerator.nextId("blk"),
                station,
                request.startTime(),
                request.endTime(),
                reason));
    }

    @Transactional
    public void deleteBlockedSlot(String blockId) {
        BlockedSlot blockedSlot = blockedSlotRepository.findByIdAndStationProviderId(
                blockId,
                currentUserService.currentProviderId())
                .orElseThrow(() -> new NotFoundException("Blocked slot not found."));
        blockedSlotRepository.delete(blockedSlot);
        blockedSlotRepository.flush();
    }

    @Transactional(readOnly = true)
    public List<BlockedSlotResponse> getCurrentProviderSpotsResponse() {
        Station station = hostStationService.getCurrentProviderStation();
        return blockedSlotRepository.findByStationIdOrderByStartTimeAsc(station.getId())
                .stream()
                .map(BlockedSlotResponse::from)
                .toList();
    }

    private BlockReason parseReason(String value) {
        try {
            return BlockReason.fromValue(value);
        } catch (IllegalArgumentException exception) {
            throw new UnprocessableEntityException("Reason must be one of: Busy, Maintenance, Personal, Other.");
        }
    }
}
