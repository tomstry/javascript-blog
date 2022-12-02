'use strict';

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
  authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  authorCloudLink: Handlebars.compile(document.querySelector('#template-author-cloud-link').innerHTML),
};

const opts = {
  tagSizes: {
    count: 5,
    classPrefix: 'tag-size-',
  },
};

const select = {
  all: {
    articles: '.post',
    linksTo: {
      tags: 'a[href^="#tag-"]',
      authors: 'a[href^="#author-"]',
    },
  },
  article: {
    tags: '.post-tags .list',
    author: '.post-author',
  },
  listOf: {
    titles: '.titles',
    tags: '.tags.list',
    authors: '.authors.list',
  },
};

function titleClickHandler(event){
  event.preventDefault();
  const clickedElement = this;
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
const optTitleSelector = '.post-title';
const optTagListSelector = '.sidebar .tags';
const optAuthorsListSelsctor = '.sidebar .authors';

function generateTitleLinks(customSelector = ''){

  /* remove contents of titleList */
  const titleList = document.querySelector(select.listOf.titles);
  titleList.innerHTML = '';
  /* for each article */
  const articles = document.querySelectorAll(select.all.articles + customSelector);
  /* get the article id */
  let html = '';

  for(let article of articles){
    const articleId = article.getAttribute('id');
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;
    
    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);
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
    params.max = Math.max(tags[tag], params.max);
    params.min = Math.min(tags[tag], params.min);
  }

  return params;
}

function calculateTagClass(count,params){
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = (normalizedCount / normalizedMax);
  const classNumber = Math.floor(percentage * (opts.tagSizes.count - 1) + 1);

  return opts.tagSizes.classPrefix + classNumber;
}

function generateTags(){
  let allTags = {};
  /* find all articles */
  const articles = document.querySelectorAll(select.all.articles);
  /* START LOOP: for every article: */
  for(let article of articles){
    const tagWrapper = article.querySelector(select.article.tags);
    let html = '';
    const articleTags = article.getAttribute('data-tags');
    const articleTagsArray = articleTags.split(' ');
    for(let tag of articleTagsArray){
      const linkHTMLData = {tag: tag};
      const linkHTML = templates.tagLink(linkHTMLData);
      html = html + linkHTML;
      if(!allTags.hasOwnProperty(tag)){
        allTags[tag] = 1;
      }else{
        allTags[tag]++;
      }
    }
    tagWrapper.innerHTML = html;
  }
  const tagList = document.querySelector(optTagListSelector);

  const tagsParams = calculateTagsParams(allTags);
  const allTagsData = {tags: []};

  for(let tag in allTags){
    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag],tagsParams),
    });
  }
  tagList.innerHTML = templates.tagCloudLink(allTagsData);
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
  const linksToTags = document.querySelectorAll(select.all.linksTo.tags);
  /* START LOOP: for each link */
  for(let link of linksToTags){
  /* add tagClickHandler as event listener for that link */
    link.addEventListener('click',tagClickHandler);
  /* END LOOP: for each link */
  }
}

function generateAuthors(){
  let allAuthors = {};
  const articles = document.querySelectorAll(select.all.articles);
  const authorsList = document.querySelector(optAuthorsListSelsctor);
  for(let article of articles){
    const authorWrapper = article.querySelector(select.article.author);
    let html = '';
    const authorTag = article.getAttribute('data-author');
    const linkAuthorData = {name: authorTag};
    const linkAuthor = templates.authorLink(linkAuthorData);
    
    html = html + linkAuthor;
    if(!allAuthors.hasOwnProperty(authorTag)){
      allAuthors[authorTag] = 1;
    }else{
      allAuthors[authorTag]++;
    }
    authorWrapper.innerHTML = html;
  }
  const allAuthorsData = {authors: []};

  for(let author in allAuthors){
    allAuthorsData.authors.push({
      name: author,
      count: allAuthors[author],
    });
  }
  authorsList.innerHTML = templates.authorCloudLink(allAuthorsData);
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
  const linksToAuthorTags = document.querySelectorAll(select.all.linksTo.authors);
  for(let link of linksToAuthorTags){
    link.addEventListener('click',authorClickHandler);
  }
}




generateTitleLinks();
generateTags();
generateAuthors();
addClickListenersToAuthors();
addClickListenersToTags();


  