package com.feelarchive.domain.archive.repository;

import com.feelarchive.domain.archive.entity.Archive;
import com.feelarchive.domain.archive.entity.ArchiveImage;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArchiveImageRepository extends JpaRepository<ArchiveImage, Long> {
  Optional<ArchiveImage> findByIdAndArchive_Id(Long id, Long archiveId);
  List<ArchiveImage> findByArchive(Archive archive);
}
