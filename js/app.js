// import, export 
// important the type module
import { CreateWebWorkerMLCEngine } from 'https://esm.run/@mlc-ai/web-llm';

const $ = el => document.querySelector(el);

// indicate element of the DOM $
const $form = $('form');
const $input = $('input');
const $template = $('#message-template');
const $messages = $('ul');
const $container = $('main');
const $button = $('button');
const $info = $('small');
let messages = [];

// const SELECTED_MODEL = "Llama-3.1-8B-Instruct-q4f32_1-MLC-1k"
const SELECTED_MODEL = "TinyLlama-1.1B-Chat-v0.4-q4f32_1-MLC";
toastr.info('¡Cargando Recursos, Espere un momento por favor!');

const engine = await CreateWebWorkerMLCEngine(
    new Worker('/js/worker.js', { type: 'module' }),
    SELECTED_MODEL,
    {
        initProgressCallback: (info) => {
            // console.log('initProgressCallback', info)
            $info.textContent = `${info.text}%`

            if (info.progress === 1) {
                $button.removeAttribute('disabled');
                toastr.options.preventDuplicates = true;
                toastr.success('¡Recursos cargados completamente, Continue!');
            }
        }
    }
);

$form.addEventListener('submit', async (event) => {
    event.preventDefault();


    if ($input.value.trim() === '') {
        return;
    }
    
    const messageText = $input.value.trim();
    if (messageText != '') {
        $input.value = '';
        return;
    }

    addMessage(messageText, 'user');
    $button.setAttribute('disabled', true);

    const userMessage = {
        role: 'user',
        content: messageText
    }

    messages.push(userMessage);

    const chunks = await engine.chat.completions.create({
        messages,
        stream: true
    });

    let reply = "";
    const $botMessage = addMessage("", 'bot');

    for await (const chunk of chunks) {
        const choice = chunk.choices[0];
        const content = choice?.delta?.content ?? "";
        reply += content;
        $botMessage.textContent = reply;
        $botMessage.classList.add('fade-in');

    }

    $button.removeAttribute('disabled')
    messages.push({
        role: 'assistant',
        content: reply,

    });
    $container.scrollTop = $container.scrollHeight;
});

function addMessage(text, sender) {
    // clone template
    const clonedTemplate = $template.content.cloneNode(true);
    const $newMessage = clonedTemplate.querySelector('.message');

    const $who = $newMessage.querySelector('span');
    const $text = $newMessage.querySelector('p');

    $text.classList.add('fade-in');
    $text.textContent = text;
    $who.textContent = sender === 'bot' ? 'GPT' : 'Tú';
    $newMessage.classList.add(sender);

    // update scroll
    $messages.appendChild($newMessage);

    // position after the message
    $container.scrollTop = $container.scrollHeight;

    return $text;
}


document.getElementById('info').addEventListener('click', async function () {
    toastr.info('WebLLM es un motor de inferencia LLM en el navegador de alto rendimiento que lleva la inferencia de modelos de lenguaje directamente a los navegadores web con aceleración de hardware. Todo se ejecuta dentro del navegador sin soporte de servidor y se acelera con WebGPU.', {
        'positionClass': 'toast-top-right'
    });
});

toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-top-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}
