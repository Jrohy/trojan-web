import { createI18n } from 'vue-i18n'
import elementEnLocale from './element/en' // element-ui lang
import elementZhLocale from './element/zh-cn'// element-ui lang
import enLocale from './en'
import zhLocale from './zh'

const messages = {
    en: {
        ...enLocale,
        ...elementEnLocale
    },
    zh: {
        ...zhLocale,
        ...elementZhLocale
    }
}
export function getLanguage() {
    const chooseLanguage = localStorage.getItem('language')
    if (chooseLanguage) return chooseLanguage

    // if has not choose language
    const language = (navigator.language || navigator.browserLanguage).toLowerCase()
    const locales = Object.keys(messages)
    for (const locale of locales) {
        if (language.indexOf(locale) > -1) {
            return locale
        }
    }
    return 'en'
}
const i18n = createI18n({
    // set locale
    // options: en | zh
    locale: getLanguage(),
    // set locale messages
    messages: messages,
    fallbackLocale: 'en',
    silentFallbackWarn: true,
    silentTranslationWarn: true
})

export default i18n
