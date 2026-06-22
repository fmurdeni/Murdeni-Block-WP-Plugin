/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import Edit from './edit';
import { featureGrid as icon } from './icons';
import './style.scss';
import './editor.scss';

/**
 * Register block
 */
registerBlockType('murdeni/feature-grid', {
    icon,
    edit: Edit,
    save: () => null, // Dynamic block, render via PHP
});
