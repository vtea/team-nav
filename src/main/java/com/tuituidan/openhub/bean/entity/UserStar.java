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
@Table(name = "nav_user_star", schema = "team_nav",
        indexes = {@Index(name = "idx_user_star_card_id", columnList = "card_id"),
                @Index(name = "idx_user_star_user_id", columnList = "user_id")})
public class UserStar implements Serializable {

    private static final long serialVersionUID = 180668924104673636L;

    @Id
    @Column(name = "id", length = 32)
    private String id;

    @Column(name = "user_id", length = 32)
    private String userId;

    @Column(name = "card_id", length = 32)
    private String cardId;

}
