package com.app.venus.shared.auditing;

import java.time.Instant;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;

@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class Auditable {

    @CreatedDate
    @Column(name = "created_instant", nullable = false, updatable = false)
    private Instant createdInstant;

    @LastModifiedDate
    @Column(name = "updated_instant", nullable = false)
    private Instant updatedInstant;

    public Instant getCreatedInstant() {
        return createdInstant;
    }

    public Instant getUpdatedInstant() {
        return updatedInstant;
    }
}