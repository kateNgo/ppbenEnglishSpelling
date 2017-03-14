/**
 * 
 */
package com.ppben.englishSpelling.dao;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;

/**
 * @author phuong
 *
 */
public class FileDao {

	/**
	 * 
	 */
	public FileDao() {

	}

	public int getCount() {
		int count = 0;
		FileReader fileReader = null;
		BufferedReader buff = null;
		PrintWriter writer = null;
		try {
			File f = new File("FileCounter.initial");
			if (!f.exists()) {
				f.createNewFile();
				writer = new PrintWriter(new FileWriter(f));
				writer.println(0);
			}
			if (writer != null) {
				writer.close();
			}
			fileReader = new FileReader(f);
			buff = new BufferedReader(fileReader);
			String initial = buff.readLine();
			count = Integer.parseInt(initial);

		} catch (Exception e) {
			if (writer != null) {
				writer.close();
			}
		}
		if (buff != null) {
			try {
				buff.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return count;
	}
	public void save(int count) throws Exception {
        FileWriter fileWriter = null;
        PrintWriter printWriter = null;
        fileWriter = new FileWriter("FileCounter.initial");
        printWriter = new PrintWriter(fileWriter);
        printWriter.println(count);

        // make sure to close the file
        if (printWriter != null) {
                printWriter.close();
        }
}

}
