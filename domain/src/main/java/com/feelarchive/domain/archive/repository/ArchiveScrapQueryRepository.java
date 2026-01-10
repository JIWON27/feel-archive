package com.feelarchive.domain.archive.repository;

import static com.feelarchive.domain.archive.entity.QArchiveScrap.archiveScrap;

import com.feelarchive.domain.archive.entity.ArchiveScrap;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class ArchiveScrapQueryRepository {

  private final JPAQueryFactory jpaQueryFactory;

  public Page<ArchiveScrap> getMyScraps(Long userId, Pageable pageable) {
    List<ArchiveScrap> scraps = jpaQueryFactory.selectFrom(archiveScrap)
        .where(archiveScrap.user.id.eq(userId))
        .orderBy(archiveScrap.createdAt.desc())
        .offset(pageable.getOffset())
        .limit(pageable.getPageSize())
        .fetch();

    JPAQuery<Long> countQuery = jpaQueryFactory
        .select(archiveScrap.count())
        .from(archiveScrap)
        .where(archiveScrap.user.id.eq(userId));

    return PageableExecutionUtils.getPage(scraps, pageable, countQuery::fetchOne);
  }
}
