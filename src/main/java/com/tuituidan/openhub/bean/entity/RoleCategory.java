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
@Table(name = "nav_role_category", schema = "team_nav",
        indexes = {@Index(name = "idx_role_category_id", columnList = "category_id"),
                @Index(name = "idx_category_role_id", columnList = "role_id")})
public class RoleCategory implements Serializable {

    private static final long serialVersionUID = 4640061239824810070L;

    @Id
    @Column(name = "id", length = 32)
    private String id;

    @Column(name = "category_id", length = 32)
    private String categoryId;

    @Column(name = "role_id", length = 32)
    private String roleId;

}
