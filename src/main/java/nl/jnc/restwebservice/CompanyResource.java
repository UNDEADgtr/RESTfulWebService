package nl.jnc.restwebservice;

import org.apache.log4j.Logger;
import org.jboss.resteasy.annotations.providers.jaxb.Formatted;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import java.util.Map;

@Path("/")
public class CompanyResource {

    private static Logger logger = Logger.getLogger(CompanyResource.class);
    private static int newId = 4;

    private Util util = new Util();

    @GET
    @Formatted
    @Produces(MediaType.APPLICATION_JSON)
    public JSONObject readApi() throws Exception {
        String msg = String.format("Get Api Docs");
        try {
            return util.getJSONApiDocs();
        } catch (Exception e) {
            logger.error(msg, e);
            throw new Exception(e);
        }
    }

    @GET
    @Formatted
    @Path("{name}")
    @Produces(MediaType.APPLICATION_JSON)
    public JSONObject read(@PathParam("name") String name) throws Exception {
        String msg = String.format("Get Api for name=%s", name);
        try {
            return util.getJSONApi(name);
        } catch (Exception e) {
            logger.error(msg, e);
            throw new Exception(e);
        }
    }

//    @PUT
//    @Formatted
//    @Path("{id}")
//    @Produces(MediaType.APPLICATION_JSON)
//    public JSONObject update(@PathParam("id") String id, JSONObject object) throws Exception {
//        String msg = String.format("Get Company configuration for companyId=%s", id);
//        try {
//            return (JSONObject) jsonObject.get(id);
//        } catch (Exception e) {
//            logger.error(msg, e);
//            throw new Exception(e);
//        }
//    }

//    @POST
//    @Formatted
//    @Produces(MediaType.APPLICATION_JSON)
//    public JSONObject create(JSONObject object) throws Exception {
//        String msg = String.format("Get Company configuration for companyId=%s", object.toJSONString());
//        try {
//
//            object.put("id", newId);
//            jsonObject.put(newId, object);
//            newId++;
//            return object;
//        } catch (Exception e) {
//            logger.error(msg, e);
//            throw new Exception(e);
//        }
//    }
//
//    @DELETE
//    @Formatted
//    @Path("{id}")
//    @Produces(MediaType.APPLICATION_JSON)
//    public JSONObject delete(@PathParam("id") String id) throws Exception {
//        String msg = String.format("Get Company configuration for companyId=%s", id);
//        try {
//            jsonObject.remove(id);
//            return null;
//        } catch (Exception e) {
//            logger.error(msg, e);
//            throw new Exception(e);
//        }
//    }
//
//    @GET
//    @Formatted
//    @Path("/ftpOut")
//    @Produces(MediaType.APPLICATION_JSON)
//    public JSONObject readFtpOut(@QueryParam("companyGln") String companyGln) throws Exception {
//        String msg = String.format(
//                "Get FtpOut configuration for companyGln=%s", companyGln);
//        try {
//            return null;
//        } catch (Exception e) {
//            logger.error(msg, e);
//            throw new Exception(e);
//        }
//    }


}