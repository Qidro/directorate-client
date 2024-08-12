import React from "react";
import axios from "axios";

const getStyles = async () => {
    const styleElements = document.querySelectorAll('style, link[rel="stylesheet"]');
    const styles: string[] = []

    for (const style of Array.from(styleElements)) {
        if (style.tagName === 'LINK' && style.hasAttribute('href')) {
            const {data} = await axios.get(style.getAttribute('href')!)
            styles.push(`<style>${data}</style>`)
        }

        styles.push(style.outerHTML)
    }

    return styles
}

export const print = async (container: React.RefObject<HTMLElement>, direction: 'vertical' | 'horizontal' = 'vertical') => {
    if(!container.current) return

    const iframe = document.createElement('iframe')
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const frameDocument = iframe.contentWindow!.document
    frameDocument.write('<!DOCTYPE html>')

    if (direction === 'horizontal') {
        frameDocument.write('<style>@page { size: landscape; }</style>')
    }

    const styles = await getStyles()
    styles.forEach(style => frameDocument.write(style))

    frameDocument.write(container.current.outerHTML);

    iframe.contentWindow!.focus();
    iframe.contentWindow!.print();
    document.body.removeChild(iframe);
}