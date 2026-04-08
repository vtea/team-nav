package com.tuituidan.openhub.bean.entity;

import java.io.Serializable;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

/**
 * Role.
 *
 * @author tuituidan
 * @version 1.0
 * @date 2023/12/2
 */
@Entity
@Getter
@Setter
@Accessors(chain = true)
@Table(name = "nav_role_user", schema = "team_nav",
        indexes = {@Index(name = "idx_role_user_id", columnList = "user_id"),
                @Index(name = "idx_user_role_id", columnList = "role_id")})
public class RoleUser implements Serializable {

    private static final long serialVersionUID = 5306375559562022028L;

    @Id
    @Column(name = "id", length = 32)
    private String id;

    @Column(name = "user_id", length = 32)
    private String userId;

    @Column(name = "role_id", length = 32)
    private String roleId;

}
