package nl.jnc.restwebservice;

import org.apache.log4j.Logger;
import org.jboss.resteasy.annotations.providers.jaxb.Formatted;
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

    private static JSONObject users;

    public CompanyResource() {
        if (users == null) {
            users = new JSONObject();

            JSONObject user = new JSONObject();

            user.put("id", 1);
            user.put("username", "user1");
            user.put("firstName", "first name 1");
            user.put("lastName", "last name 1");
            user.put("email", "email1@test.com");
            user.put("password", "XXXXXXXXXXX");
            user.put("phone", "123-456-7890");
            user.put("userStatus", 1);
            user.put("access", true);

            users.put("1", user);

            user = new JSONObject();
            user.put("id", 2);
            user.put("username", "user2");
            user.put("firstName", "first name 2");
            user.put("lastName", "last name 2");
            user.put("email", "email2@test.com");
            user.put("password", "XXXXXXXXXXX");
            user.put("phone", "123-456-7890");
            user.put("userStatus", 2);
            user.put("access", false);

            users.put("2", user);

            user = new JSONObject();
            user.put("id", 3);
            user.put("username", "user3");
            user.put("firstName", "first name 3");
            user.put("lastName", "last name 3");
            user.put("email", "email3@test.com");
            user.put("password", "XXXXXXXXXXX");
            user.put("phone", "123-456-7890");
            user.put("userStatus", 3);
            user.put("access", true);

            users.put("3", user);
        }
    }

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


    @GET
    @Formatted
    @Path("/user/{username}")
    @Produces(MediaType.APPLICATION_JSON)
    public JSONObject readUser(@PathParam("username") String username) throws Exception {
        String msg = String.format("Get user configuration for username=%s", username);
        try {
            JSONObject user = null;
            for (Object object : users.entrySet()) {
                Map.Entry entry = (Map.Entry) object;
                JSONObject u = (JSONObject) entry.getValue();
                if (u.get("username").equals(username)) {
                    user = u;
                    break;
                }
            }

            if (user == null) {
                JSONObject error = new JSONObject();
                error.put("type", "error");
                error.put("code", 404);
                error.put("reason", "The user cannot be found");
                return error;
            }
            //return Response.status(200).entity(user).build();
            return user;
        } catch (Exception e) {
            logger.error(msg, e);
            throw new Exception(e);
        }
    }

    @GET
    @Formatted
    @Path("/users/")
    @Produces(MediaType.APPLICATION_JSON)
    public JSONObject readUser(@QueryParam("username") boolean access, @QueryParam("email") String email, @QueryParam("userStatus") int userStatus) throws Exception {
        String msg = String.format("Get user configuration for access=%s, email=%s, userStatus=%s", access, email, userStatus);
        try {
            JSONObject user = null;
            for (Object object : users.entrySet()) {
                Map.Entry entry = (Map.Entry) object;
                JSONObject u = (JSONObject) entry.getValue();
                if (u.get("access").equals(access) && u.get("email").equals(email) && u.get("userStatus").equals(userStatus)) {
                    user = u;
                    break;
                }
            }

            if (user == null) {
                JSONObject error = new JSONObject();
                error.put("type", "error");
                error.put("code", 404);
                error.put("reason", "The user cannot be found");
                return error;
            }
            //return Response.status(200).entity(user).build();
            return user;
        } catch (Exception e) {
            logger.error(msg, e);
            throw new Exception(e);
        }
    }

    @GET
    @Formatted
    @Path("/user/login")
    @Produces(MediaType.APPLICATION_JSON)
    public JSONObject readUserByLogin(@QueryParam("username") String username,
                                      @QueryParam("password") String password) throws Exception {
        String msg = String.format(
                "Get user configuration for username=%s and password=%s", username, password);
        try {
            return readUser(username);// "User: " + username + ", Password: " + password;
        } catch (Exception e) {
            logger.error(msg, e);
            throw new Exception(e);
        }
    }

    @POST
    @Formatted
    @Path("/user")
    @Produces(MediaType.APPLICATION_JSON)
    public JSONObject create(JSONObject object) throws Exception {
        String msg = String.format("Get Company configuration for companyId=%s", object.toJSONString());
        try {
            object.put("id", newId);
            users.put(newId, object);
            newId++;
            return object;
        } catch (Exception e) {
            logger.error(msg, e);
            throw new Exception(e);
        }
    }

    @PUT
    @Formatted
    @Path("/user/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public JSONObject update(@PathParam("id") String id, JSONObject object) throws Exception {
        String msg = String.format("Get Company configuration for companyId=%s", id);
        try {
            return (JSONObject) users.put(id, object);
        } catch (Exception e) {
            logger.error(msg, e);
            throw new Exception(e);
        }
    }

    @DELETE
    @Formatted
    @Path("/user/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public JSONObject delete(@PathParam("id") String id) throws Exception {
        String msg = String.format("Get Company configuration for companyId=%s", id);
        try {
            users.remove(id);

            JSONObject mes = new JSONObject();
            mes.put("type", "message");
            mes.put("code", 200);
            mes.put("reason", String.format("User with id=%s deleted", id));
            return mes;
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