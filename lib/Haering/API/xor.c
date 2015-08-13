#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(int argc, char * argv[]) {

    unsigned char data[] = { 0x17, 0x02};


    unsigned char seq[4+sizeof(data)];
    seq[0] = 0x55;
    seq[1] = 0x01;
    for (int i = 0; i < sizeof(data); i++){
        seq[i+2] = data[i];
    }
    seq[sizeof(seq)-1] = 0xaa;


    unsigned char xor = 0x00;
    for (int i = 0; i < sizeof(seq)-1; i++){
         xor ^= seq[i];
    }
    seq[sizeof(seq)-2] = xor;

    for (int i = 0; i < sizeof(seq); i++){
         printf("%02x ", seq[i]);
    }

    return 0;
}
