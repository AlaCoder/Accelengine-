package tn.accelengine.modules.logs.port.in;

import java.io.File;
import tn.accelengine.modules.logs.domain.LogFileDTO;

public interface LogExplorerInput {
    LogFileDTO getLogContentByPath(String path);
    File getLogFileByPath(String path);
}
