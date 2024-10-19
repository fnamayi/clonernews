const postsContainer = document.getElementById('posts');
const loadMoreButton = document.getElementById('load-more');

let currentPage = 0;
const pageSize = 10;

async function fetchPosts() {
    const response = await fetch(`https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty`);
    const postIds = await response.json();
    const postsToLoad = postIds.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

    const posts = await Promise.all(postsToLoad.map(id => fetchPost(id)));
    renderPosts(posts);
    currentPage++;
}

async function fetchPost(id) {
    const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`);
    return response.json();
}

function renderPosts(posts) {
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';

        const titleElement = document.createElement('h2');
        titleElement.textContent = post.title;
        postElement.appendChild(titleElement);

        const authorElement = document.createElement('p');
        authorElement.textContent = `by ${post.by} | ${new Date(post.time * 1000).toLocaleString()}`;
        postElement.appendChild(authorElement);

        if (post.kids) {
            const commentsContainer = document.createElement('div');
            post.kids.forEach(commentId => fetchComment(commentId, commentsContainer));
            postElement.appendChild(commentsContainer);
        }

        postsContainer.appendChild(postElement);
    });
}

async function fetchComment(id, container) {
    const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`);
    const comment = await response.json();

    const commentElement = document.createElement('div');
    commentElement.className = 'comment';
    commentElement.innerHTML = `<strong>${comment.by}</strong>: ${comment.text}`;
    container.appendChild(commentElement);
}

loadMoreButton.addEventListener('click', fetchPosts);

// Initial fetch
fetchPosts();
