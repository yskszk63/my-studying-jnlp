import javax.swing.SwingUtilities;
import javax.swing.JOptionPane;

public class Main implements Runnable {
    public static void main(String[] args) throws Throwable {
        SwingUtilities.invokeAndWait(new Main());
    }

    public void run() {
        JOptionPane.showMessageDialog(null, "Hello, World!", "Info", JOptionPane.INFORMATION_MESSAGE);
    }
}
