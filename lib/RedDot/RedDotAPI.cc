#include <stdio.h>   		// Standard input/output definitions
#include <string.h>  		// String function definitions
#include <unistd.h>  		// UNIX standard function definitions
#include <fcntl.h>   		// File control definitions
#include <errno.h>   		// Error number definitions
#include <termios.h> 		// POSIX terminal control definitions
#include <sys/ioctl.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <stdlib.h>
#include <iostream>

using namespace std;

// API for RedDot interface
class RedDotAPI {
  int fd; // Serial Device



  // Enable/ Dsiable RTS Pins of oure serial device
  // int fd:        Serial device
  // int level:     0/1 to disable/ enable RTS
  int setRTS(int fd, int level) {
    int status;

    if (ioctl(fd, TIOCMGET, &status) == -1) {
      perror("setRTS(): TIOCMGET");
      return 0;
    }
    if (level)
      status |= TIOCM_RTS;
    else
      status &= ~TIOCM_RTS;
    if (ioctl(fd, TIOCMSET, &status) == -1) {
      perror("setRTS(): TIOCMSET");
      return 0;
    }
    return 1;
  }



  // Write binary data to Serial Device
  // int fd:                  Serial device
  // unsigned char data[]:    Content Bytes
  // int length:              Length of the content bytes array
  void writeToHaering(int fd, unsigned char data[], int length) {
    unsigned char seq[4+length]; // Alloc array for complete send buffer

    seq[0] = 0x55; // Start Byte
    seq[1] = 0x01; // Address Byte
    for (int i = 0; i < length; i++){ // Content Bytes
      seq[i+2] = data[i];
    }
    unsigned char xorBit = 0x00; // Checksum Byte
    for (int i = 0; i < sizeof(seq)-2; i++){
       xorBit ^= seq[i];
    }
    seq[sizeof(seq)-2] = xorBit;
    seq[sizeof(seq)-1] = 0xaa; // End Byte

    setRTS(fd, 0); // Disable RTS to send
    write(fd, seq, sizeof(seq)); // Write data
    usleep(1041*sizeof(seq));
  }



  // Read binary data from Serial Device
  // int fd: Serial device
  // int length: Length to read
  void readFromHaering(int fd, int length) {
    setRTS(fd, 1); // Enable RTS to send

    length = (length+3); // Read 3 more bytes than requested (otherwise it did not work)

    int i = 0;
    unsigned char arr[length];
    while (i < length){
      int err = read(fd, &arr[i], 1); // Read byte after byte
      if (err != -1) {
        printf("%02x", arr[i]); // Print it out as HEX
      }
      i++;
    }
  }



  public:
    // Init RedDotAPI
    // char device[]:     Path to serial device
    RedDotAPI(char device[]) {
      struct termios options;

      fd = open(device, O_RDWR); // | O_NOCTTY | O_NDELAY);
      if (fd == 1) {
        fprintf(stderr, "open_port: Unable to open %s - %s\n", device, strerror(errno));
      }

      fcntl(fd, F_SETFL, FNDELAY); // Configure port reading
      tcgetattr(fd, &options);
      cfsetispeed(&options, B9600); // Set the baud rates to 9600
      cfsetospeed(&options, B9600);
      cfmakeraw(&options); // Get the current options for the port

      options.c_cflag |= (CLOCAL | CREAD); // Enable the receiver and set local mode
      options.c_cflag &= ~PARENB; // Mask the character size to 8 bits, no parity
      options.c_cflag &= ~CSTOPB;
      options.c_cflag &= ~CSIZE;
      options.c_cflag |=  CS8; // Select 8 data bits
      options.c_cflag &= ~CRTSCTS; // Disable hardware flow control
      options.c_lflag &= ~(ICANON | ECHO | ISIG); // Enable data to be processed as raw input

      tcsetattr(fd, TCSANOW, &options); // Set the new options for the port
    }



    // Deinit RedDotAPI
    ~RedDotAPI() {
      close(fd);
    }



    // Send NOP to serial device
    // output:     Recived bytes
    void sendNOP() {
      unsigned char seq[] = { 0x05 };
      writeToHaering(fd, seq, sizeof(seq));
      readFromHaering(fd, 80);
    }



    // Send ACK to serial device
    // output:     0x15
    void sendACK() {
      unsigned char seq[] = { 0x06 };
      writeToHaering(fd, seq, sizeof(seq));
      readFromHaering(fd, 1);
    }



    // Set target mode to serial device
    // unsigned char mode:    ModeID to Set (LP: 0, LG: 1)
    void setMode(unsigned char mode) {
      unsigned char seq1[] = { 0x11, 0x00, 0x01 };
      writeToHaering(fd, seq1, sizeof(seq1));
      readFromHaering(fd, 1);
      unsigned char seq2[] = { mode };
      writeToHaering(fd, seq2, sizeof(seq2));
      readFromHaering(fd, 1);
    }
};



// main
//
// Ussage: [device]
//
// CLI Commands:   [mode][mode settings]
//                 band 8 (Band Move)
//                 nop
//                 set 3 (Shot Band Move)
//                 readSettings
//
// Description: Opens new RedDotAPI object with given device and calls given mode.
//
int main( int argc, char* argv[]){
  if (argc >= 2){
    RedDotAPI api(argv[1]);

    //api.sendNOP();

    char buf[BUFSIZ];
    while (fgets(buf,BUFSIZ,stdin) != NULL) {
      fflush(stdout);
      char delimiter[] = " ";
      char *mode = strtok(buf, delimiter);



      // ------------------ NOP -----------------------
      if (strncmp(mode, "nop", 3) == 0){
        api.sendNOP();
      }
      // ----------------------------------------------


      // ------------------ ACK -----------------------
      else if (strncmp(mode, "ack", 3) == 0){
        api.sendACK();
      }
      // ----------------------------------------------


      // ----------------- SET ------------------------
      else if (strncmp(mode, "set", 3) == 0){
        char *modeChar = strtok(NULL, delimiter);
        if (modeChar != NULL){
          char mode = atoi(modeChar);
          api.setMode(mode);
        }
        else {
          fprintf(stdout, "[ERROR] set Mode ID not defined\n");
        }
      }
      // ----------------------------------------------



      else {
        fprintf(stdout, "[ERROR] Mode not defined!\n");
      }


    }

    return 0;
  }
  else {
    fprintf(stdout, "Ussage: [device]\n");
    return 1;
  }
}
