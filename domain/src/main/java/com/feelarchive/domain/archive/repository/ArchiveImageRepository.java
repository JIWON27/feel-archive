package com.feelarchive.api.archive.repository;

import com.feelarchive.api.archive.domain.Archive;
import com.feelarchive.api.archive.domain.ArchiveImage;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArchiveImageRepository extends JpaRepository<ArchiveImage, Long> {
  Optional<ArchiveImage> findByIdAndArchive_Id(Long id, Long archiveId);
  List<ArchiveImage> findByArchive(Archive archive);
}
