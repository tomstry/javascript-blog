'use strict';

function titleClickHandler(event){
  event.preventDefault();
  const clickedElement = this;
  console.log('link was clicked!');
  /* remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');
  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }
  /* add class 'active' to the clicked link */
  clickedElement.classList.add('active');
  /* remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.posts article.active');
  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }
  /* get 'href' attribute from the clicked link */
  const articleSelector = clickedElement.getAttribute('href');
  /* find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(articleSelector);
  /* add class 'active' to the correct article */
  targetArticle.classList.add('active');
}
const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles';

const optArticleTagsSelector = '.post-tags .list';
const optArticleAuthorSelector = '.post-author';
const optTagListSelector = '.sidebar .tags';
const optCloudClassCount = 5;
const optCloudClassPrefix = 'tag-size-';

function generateTitleLinks(customSelector = ''){

  /* remove contents of titleList */
  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';
  /* for each article */
  const articles = document.querySelectorAll(optArticleSelector + customSelector);
  /* get the article id */
  let html = '';

  for(let article of articles){
    const articleId = article.getAttribute('id');
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;
    
    const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
    
    //titleList.insertAdjacentHTML("beforeend",linkHTML);
    html = html + linkHTML; 
  }
  /* find the title element */
  titleList.innerHTML = html;
  /* get the title from the title element */

  /* create HTML of the link */

  /* insert link into titleList */
  const links = document.querySelectorAll('.titles a');
  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }
}

function calculateTagsParams(tags){
  const params = {'min': 999999,'max': 0};

  for(let tag in tags){
    //console.log(tag + ' is used ' + tags[tag] + ' times');
    params.max = Math.max(tags[tag], params.max);
    params.min = Math.min(tags[tag], params.min);
  }

  return params;
}

function calculateTagClass(count,params){
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = (normalizedCount / normalizedMax);
  const classNumber = Math.floor(percentage * (optCloudClassCount - 1) + 1);

  return optCloudClassPrefix + classNumber;

}

function generateTags(){
  let allTags = {};
  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);
  /* START LOOP: for every article: */
  for(let article of articles){
    const tagWrapper = article.querySelector(optArticleTagsSelector);
    let html = '';
    const articleTags = article.getAttribute('data-tags');
    const articleTagsArray = articleTags.split(' ');
    for(let tag of articleTagsArray){      
      const linkHTML = '<li><a href="#tag-'+ tag +'">' +tag+ '</a></li>';
      html = html + linkHTML;
      if(!allTags.hasOwnProperty(linkHTML)){
        allTags[linkHTML] = 1;
      }else{
        allTags[linkHTML]++;
      }
    }
    tagWrapper.innerHTML = html;
  }
  const tagList = document.querySelector(optTagListSelector);

  const tagsParams = calculateTagsParams(allTags);
  
  let allTagsHTML = '';
  for(let tag in allTags){
    const href = tag.match(/href="([^"]*)/)[1];
    const tagname = href.replace('#tag-','');
    const tagLinkHTML = '<li><a href="'+ href +'" class="'+ calculateTagClass(allTags[tag],tagsParams) +'">'+ tagname +'</a> (' + allTags[tag] + ')</li>';
    allTagsHTML += tagLinkHTML;
  }
  tagList.innerHTML = allTagsHTML;
  
  /* find tags wrapper */

  /* make html variable with empty string */

  /* get tags from data-tags attribute */

  /* split tags into array */

  /* START LOOP: for each tag */

  /* generate HTML of the link */

  /* add generated code to html variable */

  /* END LOOP: for each tag */

  /* insert HTML of all the links into the tags wrapper */

  /* END LOOP: for every article: */
}

function tagClickHandler(event){
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-','');
  /* find all tag links with class active */
  const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');
  /* START LOOP: for each active tag link */
  for(let activeTagLink of activeTagLinks){
    /* remove class active */
    activeTagLink.classList.remove('active');
    /* END LOOP: for each active tag link */
  }
  /* find all tag links with "href" attribute equal to the "href" constant */
  const tagsAtributeHref = document.querySelectorAll('a[href="' + href + '"]');
  /* START LOOP: for each found tag link */
  for(let tagLink of tagsAtributeHref){
  /* add class active */
    tagLink.classList.add('active');
  /* END LOOP: for each found tag link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags(){
  /* find all links to tags */
  const linksToTags = document.querySelectorAll('a[href^="#tag-"]');
  /* START LOOP: for each link */
  for(let link of linksToTags){
  /* add tagClickHandler as event listener for that link */
    link.addEventListener('click',tagClickHandler);
  /* END LOOP: for each link */
  }
}

function generateAuthors(){
  const articles = document.querySelectorAll(optArticleSelector);
  for(let article of articles){
    const authorWrapper = article.querySelector(optArticleAuthorSelector);
    let html = '';
    const authorTag = article.getAttribute('data-author');
    const linkAuthor ='by <a href="#author-'+ authorTag +'">'+ authorTag +'</a>';
    html = html + linkAuthor;
    authorWrapper.innerHTML = html;
  }
}

function authorClickHandler(event){
  event.preventDefault();

  const clickedElement = this;

  const href = clickedElement.getAttribute('href');

  const authorTag = href.replace('#author-','');

  const activeAuthorTagLinks = document.querySelectorAll('a.active[href^="#author-"]');

  for(let activeAuthorTagLink of activeAuthorTagLinks){
    activeAuthorTagLink.classList.remove('active');
  }

  const tagsAtributeHref = document.querySelectorAll('a[href="' + href + '"]');

  for(let authorTaglink of tagsAtributeHref){
    authorTaglink.classList.add('active');
  }
  generateTitleLinks('[data-author="' + authorTag + '"]');

}

function addClickListenersToAuthors(){
  const linksToAuthorTags = document.querySelectorAll('a[href^="#author-"]');
  for(let link of linksToAuthorTags){
    link.addEventListener('click',authorClickHandler);
  }
}




generateTitleLinks();
generateTags();
generateAuthors();
addClickListenersToAuthors();
addClickListenersToTags();


  