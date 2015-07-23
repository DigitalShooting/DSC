#include <stdio.h>   /* Standard input/output definitions */
#include <string.h>  /* String function definitions */
#include <unistd.h>  /* UNIX standard function definitions */
#include <fcntl.h>   /* File control definitions */
#include <errno.h>   /* Error number definitions */
#include <termios.h> /* POSIX terminal control definitions */

#include <sys/ioctl.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <stdlib.h>


#include <iostream>

using namespace std;


class HaeringAPI {
	int fd;

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



	void writeToHaering(int fd, unsigned char data[], int length) {
		unsigned char seq[4+length];
		seq[0] = 0x55;
		seq[1] = 0x01;
		for (int i = 0; i < length; i++){
			seq[i+2] = data[i];
		}
		seq[sizeof(seq)-1] = 0xaa;


		unsigned char xorBit = 0x00;
		for (int i = 0; i < sizeof(seq)-2; i++){
			 xorBit ^= seq[i];
		}
		seq[sizeof(seq)-2] = xorBit;

		// for (int i = 0; i < sizeof(seq); i++){
		//      printf("%02x ", seq[i]);
		// }


		setRTS(fd,0);
		write(fd,seq,sizeof(seq));
		usleep(1041*sizeof(seq));
	}
	void readFromHaering(int fd, int length) {
		setRTS(fd,1);

		length = (length+1);

		int i = 0;
		unsigned char arr[length];
		while (i < length){
			// char chout[1];
			int err = read(fd, &arr[i], 1);
			if (err != -1) {
				//printf("%i %02x\n", i, arr[i]);
				printf("%02x", arr[i]);
			}
			usleep(5000);
			i++;
		}
	}





	public:
		HaeringAPI(char device[]) {
			struct termios options;

			fd = open(device, O_RDWR);// | O_NOCTTY | O_NDELAY);
			if (fd == 1) {
				fprintf(stderr, "open_port: Unable to open %s - %s\n", device, strerror(errno));
			}

			fcntl(fd, F_SETFL, FNDELAY);   /* Configure port reading */

			/* Get the current options for the port */
			tcgetattr(fd, &options);
			cfsetispeed(&options, B9600); /* Set the baud rates to 19200 */
			cfsetospeed(&options, B9600);

			/* Enable the receiver and set local mode */
			options.c_cflag |= (CLOCAL | CREAD);
			options.c_cflag &= ~PARENB; /* Mask the character size to 8 bits, no parity */
			options.c_cflag &= ~CSTOPB;
			options.c_cflag &= ~CSIZE;
			options.c_cflag |=  CS8;/* Select 8 data bits */
			options.c_cflag &= ~CRTSCTS;/* Disable hardware flow control */

			/* Enable data to be processed as raw input */
			options.c_lflag &= ~(ICANON | ECHO | ISIG);

			/* Set the new options for the port */
			tcsetattr(fd, TCSANOW, &options);

		}
		~HaeringAPI() {
			close(fd);
		}



		void sendBand() {
			unsigned char seq[] = { 0x17, 0x08 };
			writeToHaering(fd, seq, sizeof(seq));
			readFromHaering(fd, 17);
		}
		void sendNOP() {
			unsigned char seq[] = { 0x00 };
			writeToHaering(fd, seq, sizeof(seq));
			readFromHaering(fd, 17);
		}
		void sendSet() {
			unsigned char seq[] = { 0x14, 0x05, 0xFA, 0x14, 0x03, 0x09, 0x0D, 0x08, 0x4F, 0x00, 0x00, 0x00, 0x00, 0x1E, 0xDC, 0x01, 0x90 };
			writeToHaering(fd, seq, sizeof(seq));
			readFromHaering(fd, 0);
		}
		void sendReadSettings() {
			unsigned char seq[] = { 0x13, 0x00 };
			writeToHaering(fd, seq, sizeof(seq));
			readFromHaering(fd, 26);
		}

};
