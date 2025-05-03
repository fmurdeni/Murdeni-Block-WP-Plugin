/**
 * Testimonial Slider Block
 */
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import Edit from './edit';
import { testimonial } from './icons';
import './editor.scss';
import './style.scss';

// Register the block
registerBlockType('murdeni/testimonial-slider', {
    icon: testimonial,
    edit: Edit,
    save: () => null, // Dynamic block, render on PHP side
});
