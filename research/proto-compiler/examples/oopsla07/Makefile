PROGRAM = javascript multiple-inheritance traits

IDC = ../idc

all : util.so $(PROGRAM)

run : all
	./$(PROGRAM)

% : %.st
	$(IDC) $<

util.so : util.st
	$(IDC) -s $<

tidy: .FORCE
	rm -f *~

clean : tidy .FORCE
	rm -f $(PROGRAM) *.exe *.so

spotless : clean .FORCE

.FORCE :
