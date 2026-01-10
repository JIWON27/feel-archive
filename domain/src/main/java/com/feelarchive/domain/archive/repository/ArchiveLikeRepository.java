package com.feelarchive.domain.archive.repository;

import com.feelarchive.domain.archive.entity.Archive;
import com.feelarchive.domain.archive.entity.ArchiveLike;
import com.feelarchive.domain.user.entity.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArchiveLikeRepository extends JpaRepository<ArchiveLike, Long> {
  Optional<ArchiveLike> findByUserAndArchive(User user, Archive archive);
  boolean existsByUserAndArchive(User user, Archive archive);
}
