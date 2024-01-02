.SUFFIXES:
.SUFFIXES: .java .class

.PHONY: clean

classes = Main.class

serve: jar.jar
	./server.ts

jar.jar: $(classes) keystore
	jar --create --file $@ $(classes)
	jarsigner -keystore keystore -storepass password $@ test

keystore:
	keytool -genkeypair -alias test -keyalg RSA -keysize 2048 -sigalg SHA256withRSA -storepass password -dname "CN=x" -keystore $@

.java.class:
	javac -source 1.8 -target 1.8 $<

clean:
	$(RM) $(classes) jar.jar keystore
