

# Technology stack on the server side

A complete  [Spring application](https://spring.io/):

-    JDK 8  
-   [Spring Boot](https://projects.spring.io/spring-boot/)  for application configuration
-   [Gradle](http://www.gradle.org/)  configuration for building, testing and running the application
-   “dev” and “prod” profiles (for Gradle)
-   [Spring Security](https://docs.spring.io/spring-security/site/index.html)
-   [Spring MVC REST](https://spring.io/guides/gs/rest-service/)  +  [Jackson](https://github.com/FasterXML/jackson)
-   [Spring Data JPA](https://projects.spring.io/spring-data-jpa/)  + Bean Validation
-   [springfox (springfox-swagger)](https://springfox.github.io/springfox/) for generating documentation and user interface for the REST service
-   [Project Lombok](https://projectlombok.org/) to reduce the amount of code that is commonly written
-   [Problem Spring Web](https://github.com/zalando/problem-spring-web) for exception Handling

# Software Architecture
## Domain-driven design
(DDD) is an approach to developing software for complex needs by deeply connecting the implementation to an evolving model of the core business concepts.
- The Domain is the problem
- The Model is your solution

## Domain Layer
Responsible for representing concepts of the business, information about the business situation, and business rules.
The **Domain** layer is subdivided into **Entities** and **Use cases**

**Entities**


**Use cases**
Defines the jobs the software is supposed to do and coordinates the domain objects to work out problems.


## Adapters Layer
The **Adapters** layer forms the border between the **Domain** and the **Infrastructure** layer
The **Adapters** layer is subdivided into **Ports** and **Adapters**

**Ports**
A port is a entry/exit point to/from the application. it will be an interface.

Entrypoints: Are ways to interact with the application, and typically involve a delivery mechanism (e.g. REST APIs, scheduled jobs, GUI, other systems)
**Example of Input port**

Dataproviders: Retrieve and store data from and to a number of sources (database, network devices, file system, 3rd parties, etc.)
**Example of Output port**

**Adapters** Is the implementation of the ports
Example of API REST Adapter
Example of Persistence Adapter


## Infrastructure Layer
The infrastructure layer support the interactions between the others layers through Spring framework.

## Event
- To decouple components
- To perform async tasks (TODO)
- To keep track of state changes (audit log TODO)



## General configuration
### Configuring your IDE
**Gradle**
To get full Gradle support in eclipse you should install the buildship plugin.

Import your project as a Gradle project
Select File -> Import
Choose Gradle Project
Select your projects root directory (dab-server)
Click on Next and finish the wizard

**Spring**
To get full Spring support in eclipse you should install the Spring Tools

**Lombok**
The Eclipse editor is compatible with lombok.
Double-click lombok.jar (downloadable from this site, or from your maven repository; it's the same jar). 
This starts the eclipse installer which will find eclipse (and eclipse variants as listed above), and offers to install lombok into these eclipse installations.

### Application configuration
By default, Accelengine uses the “devlop” profile.

**Spring Boot standard application properties**
`/backend/src/main/resources/application.yml`

**Accelengine application properties**
`/backend/src/main/resources/application-dev.yml`
`/backend/src/main/resources/application-prod.yml`

**AccelEngine specific config **
`/backend/src/main/resources/accelengine.config`

### Running the Java server

### Config and running a database
You will need to install and configure database (PostgreSQL), don't forget to configure your Spring Boot properties accordingly in your `/backend/src/main/resources/application-*.yml`
files (for example your database URL, login and password).

### As a Gradle project
Run  Gradle task **bootRun** or **bootStandaloneBackend**
The application will be available on  [http://localhost:[port]](http://localhost:[port]).

## Accelengine Started Guides
### AuditingEntity
### Installer
### Module/Document
### Role/Action
### Authorization
### Application Setting
List<Setting> settings = new ArrayList<>();
settings.add(new Setting("test", "Test", Setting.VALUE_TYPE.STRING, "AAA", 10));
String a = AEAppSetting.getSetting("test");

### SecurityUtil
### CRUD
### Criteria (rsql)
### Pageable
### Events
### Reporting
### WebServicesUtil
to run an external web service, call the method WebServicesUtil.callWS

**INPUT:**

If the web service is Rest:
- Uri
- Type: HttpMethod.GET, HttpMethod.POST...
- HttpHeaders as HashMap
- Body as String (Json)


If the web service is SOAP: 
- Uri: link to the WSDL
- Type de méthode: HttpMethod.GET, HttpMethod.POST...
- HttpHeaders as HashMap
- Body: as String (XML)

**OUTPUT**
Returns as response an AEHttpResponsea object with attributes:
- Headers of response
- Body of response
- Status code of response
