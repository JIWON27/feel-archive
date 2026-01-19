package com.feelarchive.domain.capsule.repository;

import static com.feelarchive.domain.capsule.entity.QTimeCapsule.timeCapsule;

import com.feelarchive.domain.capsule.entity.CapsuleStatus;
import com.feelarchive.domain.capsule.entity.TimeCapsule;
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
public class TimeCapsuleQueryRepository {

  private final JPAQueryFactory jpaQueryFactory;

  public Page<TimeCapsule> getMyTimeCapsule(Long userId, CapsuleStatus capsuleStatus, Pageable pageable) {
    List<TimeCapsule> capsules = jpaQueryFactory.selectFrom(timeCapsule)
        .where(timeCapsule.user.id.eq(userId), statusEq(capsuleStatus))
        .orderBy(timeCapsule.openAt.desc())
        .offset(pageable.getOffset())
        .limit(pageable.getPageSize())
        .fetch();

    JPAQuery<Long> countQuery = jpaQueryFactory
        .select(timeCapsule.count())
        .from(timeCapsule)
        .where(timeCapsule.user.id.eq(userId));

    return PageableExecutionUtils.getPage(capsules, pageable, countQuery::fetchOne);
  }

  private BooleanExpression statusEq(CapsuleStatus capsuleStatus) {
    if (Objects.isNull(capsuleStatus)) {
      return null;
    }
    return timeCapsule.capsuleStatus.eq(capsuleStatus);
  }

}
