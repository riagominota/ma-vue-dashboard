import { DirectiveBinding, reactive } from "vue";
import useTranslationStore from '@/stores/TranslationStore'

const Tr = ($el,binding:DirectiveBinding<string|string[]>)=>{
   const attrs = reactive<{
    key:string,args:string[]|undefined
   }>({
    key:"",
    args:undefined
   }) 
    console.log($el);
    console.log(binding);
     if(binding.arg==undefined && attrs.key!=binding.value)
         attrs.key = binding.value as string
     if(binding.arg=="args" && (attrs.args as string[])!==(binding.value as string[]))
         attrs.args = binding.value as string[]


    if (!attrs.key) return;

//     // function doTranslate(trKey, trArgs) {
            
            // dont attempt translation if args attribute exists but trArgs is currently undefined
            // or any element in trArgs is undefined, prevents flicking from an error message to the real
            // translation once the arguments load
            // const hasArgsAttr = $attrs.hasOwnProperty('maTrArgs');
            const argsIsArray = Array.isArray(attrs.args);
            if (argsIsArray && (attrs.args as string[]).some(arg => typeof arg === 'undefined')) {
                return;
            }
            const Translate = useTranslationStore();
            Translate.tr(attrs.key, attrs.args || []).then( (translation:string) => {
                return {
                    failed: false,
                    text: translation
                };
            }, (error:Error) => {
                return {
                    failed: true,
                    text: '!!' + attrs.key + '!!'
                };
            }).then((result) => {
                if (result.failed) {
                    if (attrs.args && !argsIsArray) {
                        // assume failed due to args not being present yet
                        return;
                    } else {
                        console.warn('Missing translation', attrs.key);
                    }
                }
                
                const text = result.text;
                // const tagName = $el.prop('tagName');
                // if (tagName === 'IMG') {
                //     $attrs.$set('alt', text);
                //     return;
                // } else if (tagName === 'INPUT') {
                //     $attrs.$set('placeholder', text);
                //     return;
                // } else if (tagName === 'BUTTON' || $el.hasClass('md-button')) {
                //     $attrs.$set('aria-label', text);
                //     // if button already has text contents, then only set the aria-label
                //     if ($el.contents().length) return;
                // } else if (tagName === 'MDP-DATE-PICKER' || tagName === 'MDP-TIME-PICKER' ||
                //         tagName === 'MD-INPUT-CONTAINER' || tagName === 'MA-FILTERING-POINT-LIST') {
                //     $el.maFind('label').text(text);
                //     return;
                // } else if (tagName === 'MD-SELECT') {
                //     $attrs.$set('ariaLabel', text);
                //     $attrs.$set('placeholder', text);
                //     return;
                // }

                const firstChild = $el.childNodes[0];
                // if first child is a text node set the text value
                if (firstChild && firstChild.nodeType === Node.TEXT_NODE) {
                    firstChild.nodeValue = text;
                } else {
                    // else prepend a text node to its children
                    $el.prepend(document.createTextNode(text));
                }
            });
         
    
};

export default Tr;