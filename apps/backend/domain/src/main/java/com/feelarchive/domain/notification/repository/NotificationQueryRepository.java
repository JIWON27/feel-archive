package com.feelarchive.domain.notification.repository;

import static com.feelarchive.domain.notification.entity.QNotification.notification;

import com.feelarchive.domain.notification.entity.Notification;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.List;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class NotificationQueryRepository {

  private final JPAQueryFactory jpaQueryFactory;

  public Page<Notification> findNotifications(Long userId, Boolean isRead, Pageable pageable) {

    List<Notification> notifications = jpaQueryFactory
        .selectFrom(notification)
        .join(notification.user).fetchJoin()
        .where(isReadEq(isRead), notification.user.id.eq(userId))
        .offset(pageable.getOffset())
        .limit(pageable.getPageSize())
        .fetch();

    JPAQuery<Long> countQuery = jpaQueryFactory
        .select(notification.count())
        .from(notification)
        .where(isReadEq(isRead), notification.user.id.eq(userId));

    return PageableExecutionUtils.getPage(notifications, pageable, countQuery::fetchOne);
  }

  private BooleanExpression isReadEq(Boolean isRead) {
    if (Objects.isNull(isRead)) {
      return null;
    }
    return notification.read.eq(isRead);
  }

}
