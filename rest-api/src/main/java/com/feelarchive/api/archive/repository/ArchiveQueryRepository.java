package com.feelarchive.api.archive.repository;

import static com.feelarchive.api.archive.domain.QArchive.archive;

import com.feelarchive.api.archive.controller.request.ArchiveSearchCondition;
import com.feelarchive.api.archive.controller.request.ArchiveSortType;
import com.feelarchive.api.archive.domain.Archive;
import com.feelarchive.api.archive.domain.Visibility;
import com.feelarchive.api.emotion.domain.Emotion;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

@Repository
@RequiredArgsConstructor
public class ArchiveQueryRepository {

  private final JPAQueryFactory jpaQueryFactory;

  public Page<Archive> search(ArchiveSearchCondition condition, Pageable pageable) {
    List<Archive> archives = jpaQueryFactory
        .selectFrom(archive)
        .where(containsKeyword(condition.getKeyword()), emotionEq(condition.getEmotion()), filterUserOrVisibility(condition))
        .offset(pageable.getOffset())
        .limit(pageable.getPageSize())
        .orderBy(getOrderSpecifiers(condition.getSortType()))
        .fetch();

    JPAQuery<Long> countQuery = jpaQueryFactory
        .select(archive.count())
        .from(archive)
        .where(containsKeyword(condition.getKeyword()), emotionEq(condition.getEmotion()), filterUserOrVisibility(condition));

    return PageableExecutionUtils.getPage(archives, pageable, countQuery::fetchOne);
  }

  private BooleanExpression containsKeyword(String keyword) {
    if (!StringUtils.hasText(keyword)) {
      return null;
    }
    return archive.content.contains(keyword);
  }

  private BooleanExpression emotionEq(Emotion emotion) {
    if (Objects.isNull(emotion)) {
      return null;
    }
    return archive.emotion.eq(emotion);
  }

  private BooleanExpression filterUserOrVisibility(ArchiveSearchCondition condition) {
    if (Objects.nonNull(condition.getUserId())) {
      return archive.user.id.eq(condition.getUserId());
    } else {
      return archive.visibility.eq(Visibility.PUBLIC);
    }
  }

  private OrderSpecifier<?>[] getOrderSpecifiers(ArchiveSortType sortType) {
    List<OrderSpecifier<?>> orderSpecifiers = new ArrayList<>();
    if (sortType == null) {
      sortType = ArchiveSortType.LATEST;
    }

    switch (sortType) {
      // TODO case POPULAR -> orderSpecifiers.add(인기순);
      case LATEST -> orderSpecifiers.add(archive.createdAt.desc());
      case OLDEST -> orderSpecifiers.add(archive.createdAt.asc());
      // TODO case VIEWS -> orderSpecifiers.add(조회순);
      default -> orderSpecifiers.add(archive.createdAt.desc());
    }

    // 정렬 기준이 같은 경우 정렬은 PK 기준으로 한다.
    orderSpecifiers.add(archive.id.desc());

    return orderSpecifiers.toArray(OrderSpecifier[]::new);
  }
}
