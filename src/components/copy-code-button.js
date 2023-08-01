import {LitElement, html, css} from 'lit';
import { copyIcon } from './icons';

export class CopyCodeButton extends LitElement {
    static styles = [css`
        :host {
            display: block
        }
        button {
            display: flex;
            align-items: center;
            justify-content: center;
            width: fit-content;
            margin: 0;
            padding: 0.5 rem;
            background: #e2e8f022;
            border: none;
            border-radius: 0.25rem;
            color: #fff;
            cursor: pointer;
            font-weight: 600;
        }
    `]

    render() {
        return html`<button>${copyIcon}</button>`
    }
}

customElements.define('copy-code-button', CopyCodeButton);