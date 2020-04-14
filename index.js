
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
  
  let cookieChecked= await checkCookies(request);
  if(cookieChecked==null){                                      // Check for cookies if not presented call random
  
    let urls= await fetch('https://cfw-takehome.developers.workers.dev/api/variants');
    let url_data= await urls.json()
    let random_number=Math.round(Math.random());
    //console.log("inside if");
    
    let urls_1= await fetch(url_data["variants"][random_number]);
    let url_data_1= await urls_1.text();
    var abc=await myHtmlParser(url_data_1);
    let cookieName= "last_cookie"+"="+url_data["variants"][random_number];
    //abc.headers.delete('Set-Cookie');
    //console.log("cookies deleted");
    abc.headers.set('Set-Cookie',cookieName);                 //and save the cookies
  
  }

  else{

    console.log("inside else");
    let cookie_url = cookieChecked;
    //console.log(cookie_url+"hek");
    let urls_1= await fetch(cookie_url);                    //or else load the cookie url 
    let url_data_1= await urls_1.text();
    var abc=await myHtmlParser(url_data_1);
  
  }
 
  abc.headers.set('content-type','text/html');
  return abc;
    
}


async function checkCookies(request){                   //function to check if cookies exist
  let cookie= request.headers.get('Cookie');
  url=null;
  if(cookie){
    //console.log("cookie: "+ cookie)
    let pair= cookie.split(';');
    let length = pair.length;
    pair=pair[length-1]
    //console.log("pair "+ pair);
    url_pair=pair.split('=')
    //console.log(url_pair[1]);
    url=url_pair[1];
  }
  return url;

}
//HTML Parser Function
async function myHtmlParser(url_data){
  return new HTMLRewriter().on('h1,title,p,a', new ElementHandler()).transform(new Response (url_data)); 
  

}
