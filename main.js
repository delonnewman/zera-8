import ZAlien from './ZAlien';
import ZMessage from './ZAlien';

JSConsole = new ZAlien(console);
JSConsole.send(ZMessage.binary('error', "Hi"));
