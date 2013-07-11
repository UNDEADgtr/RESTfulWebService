package nl.jnc.restwebservice;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;

/**
 * Created by
 * User: Khralovich Dzmitry
 * Date: 10.07.13
 * Time: 12:27
 */
public class Util {

    JSONParser parser = new JSONParser();

    public JSONObject getJSONApiDocs() {
        JSONObject jsonObject = null;
        try {
            InputStream stream = getClass().getResourceAsStream("api-docs.json");
            Reader reader = new InputStreamReader(stream);

            jsonObject = (JSONObject) parser.parse(reader);
        } catch (ParseException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

        return jsonObject;
    }

    public JSONObject getJSONApi(String nameApi) {
        JSONObject jsonObject = null;
        try {
            InputStream stream = getClass().getResourceAsStream(nameApi + ".json");
            Reader reader = new InputStreamReader(stream);

            jsonObject = (JSONObject) parser.parse(reader);
        } catch (ParseException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

        return jsonObject;
    }

}
