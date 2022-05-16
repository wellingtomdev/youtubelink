const permited_domains = [
    'www.youtube.com',
    'youtube.com',
    'www.youtu.be',
    'youtu.be',
]

const models = {
    embed: video_id => `/embed/${video_id}`,
    site: video_id => `/watch?v=${video_id}`,
    shorts: video_id => `/shorts/${video_id}`,
    shareable: video_id => `/${video_id}`,
}

function getThumbnails(video_id) {
    const urls = [
        { name: 'maxresdefault', url: `https://img.youtube.com/vi/${video_id}/maxresdefault.jpg` },
        { name: 'hqdefault', url: `https://img.youtube.com/vi/${video_id}/hqdefault.jpg` },
        { name: 'mqdefault', url: `https://img.youtube.com/vi/${video_id}/mqdefault.jpg` },
        { name: 'sddefault', url: `https://img.youtube.com/vi/${video_id}/sddefault.jpg` },
        { name: 'default', url: `https://img.youtube.com/vi/${video_id}/default.jpg` },
    ]
    return urls
}


function getInfoUrl(link) {
    function isValidId(id) {
        return id.length == 11 ? true : false
    }
    function getTextWithId() {
        return verifiedUrl.href.split(verifiedUrl.model)[1]
    }
    function removeGarbage(textWithId) {
        if (textWithId.includes('&') || textWithId.includes('?')) {
            return textWithId
                .replace('?', '||||')
                .replaceAll('&', '||||')
                .split('||||')[0]
        }
        return textWithId
    }
    const verifiedUrl = checkUrl(link)
    if (!verifiedUrl) { return }
    const textWithId = getTextWithId()
    const video_id = removeGarbage(textWithId)
    if (!isValidId(video_id)) { return false }
    const params = {}
    verifiedUrl.searchParams.forEach((value, key) => {
        if (key == 'v') { return }
        params[key] = value
    })
    return {
        params,
        video_id,
    }
}

function getBasicInfoByLink(link = '') {
    const infoUrl = getInfoUrl(link)
    if (!infoUrl) { return }
    const { video_id, params } = infoUrl
    if (!video_id) { return }
    const links = {
        iframe: encodeInLink(video_id, 'iframe'),
        shareable: encodeInLink(video_id, 'shareable'),
        site: encodeInLink(video_id, 'site'),
    }
    const thumbnails_list = getThumbnails(video_id)
    const thumbnails = {}
    for (let a = 0; a < thumbnails_list.length; a++) {
        const item = thumbnails_list[a];
        thumbnails[item.name] = item.url
    }
    return {
        video_id,
        links,
        thumbnails,
        params,
    }
}

function encodeInLink(video_id = '', functionLink = 'iframe') {
    const result = models[functionLink];
    if (result) {
        return result(video_id);
    }
    return models.shareable(video_id);
}


function checkUrl(link = '') {
    try {
        function getModelIncluded() {
            const listModels = Object.values(models).map(item => item(''))
            for (let index = 0; index < listModels.length; index++) {
                const model = listModels[index]
                if (link.indexOf(model) !== -1) {
                    return `${url.origin}${model}`
                }
            }
            return false
        }
        const url = new URL(link)
        if (!permited_domains.includes(url.host)) { return false }
        const model = getModelIncluded()
        if (!model) { return false }
        url.model = model
        return url
    } catch (error) {
        return false
    }

}





function youtubeLink(link) {

    const basicInfo = getBasicInfoByLink(link)
    const videoId = basicInfo?.video_id

    // console.log(basicInfo)
    return {
        ...basicInfo?.params,
        getBasicInfoByLink: basicInfo,
        encodeInLink: (...values) => encodeInLink(videoId, ...values),
        getThumbnails: () => getThumbnails(videoId),
        getVideoId: () => videoId,
        videoId,
        basicInfo,
        models
    }
}

// export default youtubeLink
module.exports = youtubeLink
