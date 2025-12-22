package com.feelarchive.api.archive.repository;

import com.feelarchive.api.archive.domain.Archive;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArchiveRepository extends JpaRepository<Archive, Long> {

}
