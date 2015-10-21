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

// API for Haering ESA interface
class HaeringAPI {
	int fd;												// Serial Device



	// Enable/ Dsiable RTS Pins of oure serial device
	// int fd: 		Serial device
	// int level: 	0/1 to disable/ enable RTS
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
	// int fd: 					Serial device
	// unsigned char data[]:	Content Bytes
	// int length:				Length of the content bytes array
	void writeToHaering(int fd, unsigned char data[], int length) {
		unsigned char seq[4+length];					// Alloc array for complete send buffer

		seq[0] = 0x55;									// Start Byte
		seq[1] = 0x01;									// Address Byte
		for (int i = 0; i < length; i++){				// Content Bytes
			seq[i+2] = data[i];
		}
		unsigned char xorBit = 0x00;					// Checksum Byte
		for (int i = 0; i < sizeof(seq)-2; i++){
			 xorBit ^= seq[i];
		}
		seq[sizeof(seq)-2] = xorBit;
		seq[sizeof(seq)-1] = 0xaa;						// End Byte

		setRTS(fd, 0);									// Disable RTS to send
		write(fd, seq, sizeof(seq));					// Write data
		usleep(1041*sizeof(seq));
	}



	// Read binary data from Serial Device
	// int fd: 					Serial device
	// int length:				Length to read
	void readFromHaering(int fd, int length) {
		setRTS(fd, 1);									// Enable RTS to send

		length = (length+3);							// Read 3 more bytes than requested (otherwise it did not work)

		int i = 0;
		unsigned char arr[length];
		while (i < length){
			int err = read(fd, &arr[i], 1);				// Read byte after byte
			if (err != -1) {
				printf("%02x", arr[i]);					// Print it out as HEX
			}
			usleep(50000);								// Wait for the next one
			i++;
		}
	}



	public:
		// Init HaeringAPI
		// char device[]: 		Path to serial device
		HaeringAPI(char device[]) {
			struct termios options;

			fd = open(device, O_RDWR);						// | O_NOCTTY | O_NDELAY);
			if (fd == 1) {
				fprintf(stderr, "open_port: Unable to open %s - %s\n", device, strerror(errno));
			}

			fcntl(fd, F_SETFL, FNDELAY);   					// Configure port reading
			tcgetattr(fd, &options);
			cfsetispeed(&options, B9600); 					// Set the baud rates to 19200
			cfsetospeed(&options, B9600);
			cfmakeraw(&options);							// Get the current options for the port

			options.c_cflag |= (CLOCAL | CREAD);			// Enable the receiver and set local mode
			options.c_cflag &= ~PARENB;						// Mask the character size to 8 bits, no parity
			options.c_cflag &= ~CSTOPB;
			options.c_cflag &= ~CSIZE;
			options.c_cflag |=  CS8;						// Select 8 data bits
			options.c_cflag &= ~CRTSCTS;					// Disable hardware flow control
			options.c_lflag &= ~(ICANON | ECHO | ISIG);		// Enable data to be processed as raw input

			tcsetattr(fd, TCSANOW, &options);				// Set the new options for the port
		}



		// Deinit HaeringAPI
		~HaeringAPI() {
			close(fd);
		}



		// Send paper move to serial device
		// unsigned char time:		Time to move (0-255)
		void sendBand(unsigned char time) {
			unsigned char seq[] = { 0x17, time };
			writeToHaering(fd, seq, sizeof(seq));
			readFromHaering(fd, 17);
		}



		// Send NOP to serial device
		// output: 					Recived bytes
		void sendNOP() {
			unsigned char seq[] = { 0x00 };
			writeToHaering(fd, seq, sizeof(seq));
			readFromHaering(fd, 17);
		}



		// Send Config to serial device
		// unsigned char time:		Time to move after each shot (0-255)
		void sendSet(unsigned char time) {
			unsigned char seq[] = { 0x14, 0x05, 0xFA, 0x14, time, 0x09, 0x0D, 0x08, 0x4F, 0x00, 0x00, 0x00, 0x00, 0x1E, 0xDC, 0x01, 0x90 };
			writeToHaering(fd, seq, sizeof(seq));
			readFromHaering(fd, 0);
		}



		// Read settings from serial device
		// output: 					Settings
		void sendReadSettings() {
			unsigned char seq[] = { 0x13, 0x00 };
			writeToHaering(fd, seq, sizeof(seq));
			readFromHaering(fd, 26);
		}


		
};



// main
//
// Ussage: 		[device] 	[mode] 			[mode settings]
//				/dev/ttyS1	band			8 (Band Move)
//				/dev/ttyS1	nop
//				/dev/ttyS1	set				3 (Shot Band Move)
//				/dev/ttyS1	readSettings
//
// Description: Opens new HaeringAPI object with given device and calls given mode.
//
int main( int argc, char* argv[]){
	if (argc >= 3){
		HaeringAPI api(argv[1]);

		// ------------------ BAND ----------------------
		if (strcmp(argv[2], "band") == 0){
			if (argc >= 4){
				char band_time = atoi(argv[3]);
				api.sendBand(band_time);
			}
			else {
				printf("[ERROR] onChangePart Move Time not defined\n");
			}
		}
		// ----------------------------------------------


		// ------------------ NOP -----------------------
		else if (strcmp(argv[2], "nop") == 0){
			api.sendNOP();
		}
		// ----------------------------------------------


		// ----------------- SET ------------------------
		else if (strcmp(argv[2], "set") == 0){
			if (argc >= 4){
				char band_time = atoi(argv[3]);
				api.sendSet(band_time);
			}
			else {
				printf("[ERROR] onShot Move Time not defined\n");
			}
		}
		// ----------------------------------------------


		// ---------------- READSETTINGS ----------------
		else if (strcmp(argv[2], "readSettings") == 0){
			api.sendReadSettings();
		}
		// ----------------------------------------------

		else {
			printf("[ERROR] Mode not defined!\n");
		}
	}
	else {
		printf("Ussage: [device] [mode] [mode settings]\n");
	}
}
