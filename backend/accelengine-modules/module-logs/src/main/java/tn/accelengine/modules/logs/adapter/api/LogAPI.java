package tn.accelengine.modules.logs.adapter.api;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tn.accelengine.core.utils.FileUtil;
import tn.accelengine.modules.logs.domain.RequestLogExplorerUI;
import tn.accelengine.modules.logs.domain.LogFileDTO;
import tn.accelengine.modules.logs.port.in.LogExplorerInput;

@RestController
@RequestMapping(value = LogAPI.ENDPOINT)
public class LogAPI {
    private static final Logger log = LoggerFactory.getLogger(LogAPI.class);
    public static final String ENDPOINT = "/api/logs";
    private final LogExplorerInput logExplorerInput;

    public LogAPI(LogExplorerInput logExplorerInput) {
        this.logExplorerInput = logExplorerInput;
    }

    @PostMapping("/getlogcontentbypath")
    public ResponseEntity<LogFileDTO> getLogContentByPath(@RequestBody RequestLogExplorerUI requestLogExplorerDTO) {
        LogFileDTO data = this.logExplorerInput.getLogContentByPath(requestLogExplorerDTO.getLogPath());
        return ResponseEntity.ok(data);
    }

    @PostMapping(
        value = "/downloadlog",
        produces = {"*/*"}
    )
    public ResponseEntity<FileSystemResource> downloadLogFile(@RequestBody RequestLogExplorerUI requestLogExplorerDTO) {
        String name = null;
        String contentType = null;
        File file = this.logExplorerInput.getLogFileByPath(requestLogExplorerDTO.getLogPath());
        if (file != null) {
            name = file.getName();
            if (file.isDirectory()) {
                file = FileUtil.zip(file, new File(requestLogExplorerDTO.getLogPath() + ".zip"), false);
            }

            try {
                contentType = Files.probeContentType(file.toPath());
            } catch (IOException var6) {
                var6.printStackTrace();
            }
        }

        if (contentType == null) {
            contentType = "text/plain";
        }

        return ((ResponseEntity.BodyBuilder)ResponseEntity.status(HttpStatus.OK)
            .header("Content-Disposition", new String[]{"attachment; filename=\"" + name + "\""}))
            .contentType(MediaType.valueOf(contentType))
            .body(new FileSystemResource(file));
    }

    @PostMapping("/listlogfiles")
    public ResponseEntity<List<String>> listLogFiles(@RequestBody RequestLogExplorerUI requestLogExplorerDTO) {
        File folder = new File(requestLogExplorerDTO.getLogPath());
        if (folder.isDirectory()) {
            List<String> logFiles = Stream.of(folder.listFiles())
                .filter(File::isFile)
                .map(File::getName)
                .collect(Collectors.toList());
            return ResponseEntity.ok(logFiles);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Collections.emptyList());
        }
    }
}
