package com.feelarchive.api.archive.repository;

import com.feelarchive.api.archive.domain.Archive;
import com.feelarchive.api.user.domain.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ArchiveRepository extends JpaRepository<Archive, Long> {

  List<Archive> findByUser(User user);

  @Modifying(clearAutomatically = true)
  @Query("UPDATE Archive a SET a.likeCount = a.likeCount + 1 WHERE a.id = :id")
  void increaseLikeCount(@Param("id") Long id);

  @Modifying(clearAutomatically = true)
  @Query("UPDATE Archive a SET a.likeCount = a.likeCount - 1 WHERE a.id = :id")
  void decreaseLikeCount(@Param("id") Long id);
}
