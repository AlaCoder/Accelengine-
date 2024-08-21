package tn.accelengine.modules.logs.usecase;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.LinkOption;
import java.nio.file.Path;
import java.nio.file.Paths;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import tn.accelengine.core.annotations.AEUseCase;
import tn.accelengine.core.exceptions.AETechnicalException;
import tn.accelengine.modules.logs.domain.LogFileDTO;
import tn.accelengine.modules.logs.port.in.LogExplorerInput;

@AEUseCase
public class LogExplorerUseCase implements LogExplorerInput {
    private static final Logger log = LoggerFactory.getLogger(LogExplorerUseCase.class);

    public LogExplorerUseCase() {
    }

    @Override
    public LogFileDTO getLogContentByPath(String path) {
        Path logPath = Paths.get(path);
        if (Files.notExists(logPath, new LinkOption[0])) {
            throw new AETechnicalException("Log file doesn't exist in the filesystem!");
        }

        LogFileDTO logFileDTO = new LogFileDTO();
        try {
            String content = new String(Files.readAllBytes(logPath));
            logFileDTO.setContent(content);
        } catch (IOException e) {
            log.error("Failed to read log file at path: " + path, e);
            logFileDTO.setContent("Error reading file: " + e.getMessage());
        }
        return logFileDTO;
    }

    @Override
    public File getLogFileByPath(String path) {
        Path logPath = Paths.get(path);
        if (Files.notExists(logPath, new LinkOption[0])) {
            throw new AETechnicalException("Log file doesn't exist in the filesystem!");
        }
        return logPath.toFile();
    }
}
