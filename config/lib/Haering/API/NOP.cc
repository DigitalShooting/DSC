#include "./HaeringAPI.cc"

int main(int argc, char* argv[]) {
	if (argc < 2) {
		return 1;
	}

	HaeringAPI api(argv[1]);
	api.sendNOP();

	return 0;
}
