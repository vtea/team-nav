package com.tuituidan.openhub.bean.entity;

import java.time.LocalDateTime;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

/**
 * Notice.
 *
 * @author tuituidan
 * @version 1.0
 * @date 2022/11/20
 */
@Entity
@Getter
@Setter
@Accessors(chain = true)
@Table(name = "nav_notice", schema = "team_nav")
@DynamicUpdate
@DynamicInsert
public class Notice implements ISortEntity<Notice> {

    private static final long serialVersionUID = 5686996589966592484L;

    @Id
    @Column(name = "id", length = 32)
    private String id;

    @Column(name = "content", columnDefinition = "text")
    private String content;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Column(name = "sort")
    private Integer sort;

}
