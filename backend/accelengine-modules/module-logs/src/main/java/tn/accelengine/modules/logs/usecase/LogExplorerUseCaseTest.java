package tn.accelengine.modules.logs.usecase;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import tn.accelengine.core.exceptions.AETechnicalException;
import tn.accelengine.modules.logs.domain.LogFileDTO;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.*;

class LogExplorerUseCaseTest {

    private LogExplorerUseCase logExplorerUseCase;

    @BeforeEach
    void setUp() {
        logExplorerUseCase = new LogExplorerUseCase();
    }

    @Test
    void testGetLogContentByPath(@TempDir Path tempDir) throws IOException {
        // Créer un fichier de log temporaire
        Path logFile = tempDir.resolve("test.log");
        String logContent = "This is a test log content.";
        Files.write(logFile, logContent.getBytes());

        // Appeler la méthode à tester
        LogFileDTO logFileDTO = logExplorerUseCase.getLogContentByPath(logFile.toString());

        // Vérifier le résultat
        assertNotNull(logFileDTO);
        assertEquals(logContent, logFileDTO.getContent());
    }

    @Test
    void testGetLogContentByPath_FileNotFound() {
        // Chemin du fichier de log inexistant
        String nonExistentPath = "non_existent.log";

        // Appeler la méthode et vérifier qu'elle lance une exception
        Exception exception = assertThrows(AETechnicalException.class, () -> {
            logExplorerUseCase.getLogContentByPath(nonExistentPath);
        });

        // Vérifier le message de l'exception
        String expectedMessage = "Log file doesn't exist in the filesystem!";
        String actualMessage = exception.getMessage();
        assertTrue(actualMessage.contains(expectedMessage));
    }

    @Test
    void testGetLogFileByPath(@TempDir Path tempDir) throws IOException {
        // Créer un fichier de log temporaire
        Path logFile = tempDir.resolve("test.log");
        Files.createFile(logFile);

        // Appeler la méthode à tester
        File file = logExplorerUseCase.getLogFileByPath(logFile.toString());

        // Vérifier le résultat
        assertNotNull(file);
        assertEquals(logFile.toString(), file.getPath());
    }

    @Test
    void testGetLogFileByPath_FileNotFound() {
        // Chemin du fichier de log inexistant
        String nonExistentPath = "non_existent.log";

        // Appeler la méthode et vérifier qu'elle lance une exception
        Exception exception = assertThrows(AETechnicalException.class, () -> {
            logExplorerUseCase.getLogFileByPath(nonExistentPath);
        });

        // Vérifier le message de l'exception
        String expectedMessage = "Log file doesn't exist in the filesystem!";
        String actualMessage = exception.getMessage();
        assertTrue(actualMessage.contains(expectedMessage));
    }
}
