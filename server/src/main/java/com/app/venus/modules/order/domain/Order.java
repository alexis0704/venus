package com.app.venus.modules.order.domain;

import com.app.venus.shared.auditing.Auditable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "charging_order")
public class Order extends Auditable {
    @Id
    @Column(length = 40)
    private String id;

    protected Order() {
    }

    public Order(String id) {
        this.id = id;
    }

    public String getId() {
        return id;
    }
}
