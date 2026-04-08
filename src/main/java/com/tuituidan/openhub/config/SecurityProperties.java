package com.tuituidan.openhub.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * 匿名/登录用户可访问的 URL 白名单。
 * 必须使用独立前缀 {@code nav.security}，勿放在 {@code spring.security} 下，
 * 否则与 Spring Boot 自带的 {@code spring.security.*} 配置绑定冲突，导致白名单不生效（全部为 401）。
 *
 * @author tuituidan
 * @version 1.0
 * @date 2024/2/23
 */
@Configuration
@ConfigurationProperties(prefix = "nav.security")
@Getter
@Setter
public class SecurityProperties {

    private String[] permitUrl;

    private String[] generalUserUrl;
}
