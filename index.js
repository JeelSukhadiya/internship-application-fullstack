
addEventListener('fetch',event=>{
  var abc = getUrls(event.request);
  event.respondWith(abc)
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */

//Element Handler Class to change the html tags
class ElementHandler {
  element(element) {
    

    if(element.tagName=="title"){
      element.setInnerContent("Cloudflare Online Assessment");
    }
    if(element.tagName=="h1"){
      if(element.getAttribute("id")=="title")
        element.prepend("Cloudflare Online Assessment:");
    }
    if(element.tagName=="p"){
      if(element.getAttribute("id")=="description")
        element.prepend("This is the Cloudflare Online Assessment and ");
    }

    if(element.tagName == "a"){
      if(element.getAttribute("id")=="url"){
        element.setAttribute("href","https://www.facebook.com/"); 
        element.setInnerContent("Click on this to go to Facebook.com");
      }
    }
   
  }

}
// Function to fetch the URL'S
async function getUrls(request){
  let urls= await fetch('https://cfw-takehome.developers.workers.dev/api/variants');
  let url_data= await urls.json()
  let random_number=Math.round(Math.random());

  
  let urls_1= await fetch(url_data["variants"][random_number]);
  let url_data_1= await urls_1.text();
  let abc=await myHtmlParser(url_data_1);
 
  abc.headers.set('content-type','text/html');
  return abc;
  
  
}

//HTML Parser Function
async function myHtmlParser(url_data){
  return new HTMLRewriter().on('h1,title,p,a', new ElementHandler()).transform(new Response (url_data)); 
  

}
