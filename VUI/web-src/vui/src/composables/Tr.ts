import { DirectiveBinding, reactive } from "vue";
import useTranslationStore from '@/stores/TranslationStore'
import { transferableAbortSignal } from "util";

const Tr = ($el:HTMLElement,binding:DirectiveBinding<string|string[]>)=>{
   const attrs = reactive<{
    key:string,args:string[]|undefined
   }>({
    key:"",
    args:undefined
   }) 
    // console.log($el);
    // console.log(binding);
     if(binding.arg==undefined && attrs.key!=binding.value)
         attrs.key = binding.value.toString() as string
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
            let translation = "";
            let failed:boolean;
            try
            {
             translation = Translate.tr(attrs.key, attrs.args || [])
            // .then( (translation:string) => {
                
               failed= false,
               translation
                
            }
            catch(e)
            {
            // , (error:Error) => {
                // return {
                failed = true,
                translation= '!!' + attrs.key + '!!'
                // };
            }
        
        // ).then((result) => {
        if (failed) {
            if (attrs.args && !argsIsArray) {
                // assume failed due to args not being present yet
              //  return;
            } else {
                console.warn('Missing translation', attrs.key);
            }
        }
                
            const text = translation;
                const tagName = $el.tagName;
                console.log(tagName)
                 if (tagName === 'IMG') {
                    $el.setAttribute('alt', text);
                     return;
                } else if (tagName === 'INPUT') {
                    $el.setAttribute('placeholder', text);
                     return;
                } else if (tagName === 'BUTTON' ) {
                    $el.setAttribute('aria-label', text);
                    $el.setAttribute('label', text);
                    const buttonLabel = $el.querySelector('.p-button-label') as HTMLSpanElement;
                    buttonLabel.innerText = text;
                   // buttonLabel?.innerText = text;
                    // if button already has text contents, then only set the aria-label
                    if ($el.innerText.length) return;
                /* } else if (tagName === 'MDP-DATE-PICKER' || tagName === 'MDP-TIME-PICKER' ||
                        tagName === 'MD-INPUT-CONTAINER' || tagName === 'MA-FILTERING-POINT-LIST') {
                    $el.querySelector('label').text(text);
                    return; */
                } else if (tagName === 'DIV' ) {
                    const isWrapper = $el.classList.contains('p-inputwrapper');
                    console.log(`īsWrapper: ${isWrapper}`)
                    if(isWrapper)
                    {
                        const input = $el.querySelector('.p-inputtext') as HTMLInputElement;
                        if(input)
                            input.placeholder = text;
                   
                        return;
                    }
                } else if (tagName === 'SELECT') {
                    $el.setAttribute('ariaLabel', text);
                    $el.setAttribute('placeholder', text);
                    return;
                }

                const firstChild = $el.childNodes[0];
                // if first child is a text node set the text value
                if (firstChild && firstChild.nodeType === Node.TEXT_NODE) {
                    firstChild.nodeValue = text;
                } else {
                    // else prepend a text node to its children
                    $el.prepend(document.createTextNode(text));
                }
            // };
};

export default Tr;