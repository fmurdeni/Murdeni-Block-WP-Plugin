/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
    PanelBody,
    RangeControl,
    SelectControl,
    ToggleControl,
    TextControl,
    Placeholder,
    Spinner,
    __experimentalNumberControl as NumberControl,
    ColorPicker,
} from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import ServerSideRender from '@wordpress/server-side-render';

/**
 * Internal dependencies
 */
import { portfolioGrid as icon } from './icons';

/**
 * Edit component
 */
export default function Edit({ attributes, setAttributes }) {
    const {
        postType,
        postsToShow,
        order,
        orderBy,
        categories,
        tags,
        taxonomies,
        columns,
        displayTitle,
        displayCategory,
        imageSize,
        aspectRatio,
        gridGap,
        titleFontSize,
        metaFontSize,
        hoverEffect,
        overlayColor,
        overlayTextColor,
        borderRadius,
        overlayContentPosition,
    } = attributes;

    // State for post types, taxonomies, and terms
    const [postTypes, setPostTypes] = useState([]);
    const [availableTaxonomies, setAvailableTaxonomies] = useState([]);
    const [availableTerms, setAvailableTerms] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [imageSizes, setImageSizes] = useState([
        { label: __('Thumbnail', 'murdeni-blocks'), value: 'thumbnail' },
        { label: __('Medium', 'murdeni-blocks'), value: 'medium' },
        { label: __('Large', 'murdeni-blocks'), value: 'large' },
        { label: __('Full', 'murdeni-blocks'), value: 'full' },
    ]);

    // Fetch post types on component mount
    useEffect(() => {
        fetchPostTypes();
    }, []);

    // Fetch taxonomies when post type changes
    useEffect(() => {
        if (postType) {
            fetchTaxonomies(postType);
        }
    }, [postType]);

    // Fetch post types from API
    const fetchPostTypes = async () => {
        try {
            setIsLoading(true);
            const response = await apiFetch({ path: '/murdeni-post-grid/v1/post-types' });
            setPostTypes(response);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching post types:', error);
            setIsLoading(false);
        }
    };

    // Fetch taxonomies for a post type
    const fetchTaxonomies = async (postType) => {
        try {
            setIsLoading(true);
            const response = await apiFetch({ path: `/murdeni-post-grid/v1/taxonomies/${postType}` });
            setAvailableTaxonomies(response);
            
            // Fetch terms for each taxonomy
            const termsPromises = response.map(tax => fetchTerms(tax.value));
            await Promise.all(termsPromises);
            
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching taxonomies:', error);
            setIsLoading(false);
        }
    };

    // Fetch terms for a taxonomy
    const fetchTerms = async (taxonomy) => {
        try {
            const response = await apiFetch({ path: `/murdeni-post-grid/v1/terms/${taxonomy}` });
            setAvailableTerms(prevTerms => ({
                ...prevTerms,
                [taxonomy]: response,
            }));
        } catch (error) {
            console.error(`Error fetching terms for ${taxonomy}:`, error);
        }
    };

    // Handle taxonomy term selection
    const handleTermSelection = (taxonomy, termIds) => {
        setAttributes({
            taxonomies: {
                ...taxonomies,
                [taxonomy]: termIds,
            },
        });
    };

    // Block props
    const blockProps = useBlockProps();

    // If loading, show spinner
    if (isLoading && !postTypes.length) {
        return (
            <div {...blockProps}>
                <Placeholder
                    icon={icon}
                    label={__('Murdeni Portfolio Grid', 'murdeni-blocks')}
                >
                    <Spinner />
                </Placeholder>
            </div>
        );
    }

    return (
        <div {...blockProps}>
            <InspectorControls>
                {/* Content Settings */}
                <PanelBody title={__('Content Settings', 'murdeni-blocks')} initialOpen={true}>
                    <SelectControl
                        label={__('Post Type', 'murdeni-blocks')}
                        value={postType}
                        options={postTypes}
                        onChange={(value) => setAttributes({ postType: value })}
                    />

                    <RangeControl
                        label={__('Number of Items', 'murdeni-blocks')}
                        value={postsToShow}
                        onChange={(value) => setAttributes({ postsToShow: value })}
                        min={1}
                        max={50}
                    />

                    <SelectControl
                        label={__('Order By', 'murdeni-blocks')}
                        value={orderBy}
                        options={[
                            { label: __('Date', 'murdeni-blocks'), value: 'date' },
                            { label: __('Title', 'murdeni-blocks'), value: 'title' },
                            { label: __('Menu Order', 'murdeni-blocks'), value: 'menu_order' },
                            { label: __('Random', 'murdeni-blocks'), value: 'rand' },
                            { label: __('Comment Count', 'murdeni-blocks'), value: 'comment_count' },
                        ]}
                        onChange={(value) => setAttributes({ orderBy: value })}
                    />

                    <SelectControl
                        label={__('Order', 'murdeni-blocks')}
                        value={order}
                        options={[
                            { label: __('Descending', 'murdeni-blocks'), value: 'desc' },
                            { label: __('Ascending', 'murdeni-blocks'), value: 'asc' },
                        ]}
                        onChange={(value) => setAttributes({ order: value })}
                    />

                    {/* Taxonomy Filters */}
                    {availableTaxonomies.map((taxonomy) => {
                        const terms = availableTerms[taxonomy.value] || [];
                        
                        if (!terms.length) return null;
                        
                        return (
                            <div key={taxonomy.value} className="murdeni-portfolio-grid-taxonomy-filter">
                                <h3>{taxonomy.label}</h3>
                                <SelectControl
                                    multiple
                                    value={taxonomies[taxonomy.value] || []}
                                    options={terms}
                                    onChange={(selectedTerms) => handleTermSelection(taxonomy.value, selectedTerms)}
                                />
                            </div>
                        );
                    })}
                </PanelBody>

                {/* Layout Settings */}
                <PanelBody title={__('Layout Settings', 'murdeni-blocks')} initialOpen={false}>
                    <RangeControl
                        label={__('Columns', 'murdeni-blocks')}
                        value={columns}
                        onChange={(value) => setAttributes({ columns: value })}
                        min={1}
                        max={6}
                    />

                    <SelectControl
                        label={__('Image Size', 'murdeni-blocks')}
                        value={imageSize}
                        options={imageSizes}
                        onChange={(value) => setAttributes({ imageSize: value })}
                    />

                    <SelectControl
                        label={__('Aspect Ratio', 'murdeni-blocks')}
                        value={aspectRatio}
                        options={[
                            { label: __('1:1 (Square)', 'murdeni-blocks'), value: '1:1' },
                            { label: __('4:3', 'murdeni-blocks'), value: '4:3' },
                            { label: __('16:9', 'murdeni-blocks'), value: '16:9' },
                            { label: __('3:4', 'murdeni-blocks'), value: '3:4' },
                            { label: __('9:16', 'murdeni-blocks'), value: '9:16' },
                        ]}
                        onChange={(value) => setAttributes({ aspectRatio: value })}
                    />

                    <RangeControl
                        label={__('Grid Gap (px)', 'murdeni-blocks')}
                        value={gridGap}
                        onChange={(value) => setAttributes({ gridGap: value })}
                        min={0}
                        max={50}
                    />
                </PanelBody>

                {/* Display Settings */}
                <PanelBody title={__('Display Settings', 'murdeni-blocks')} initialOpen={false}>
                    <ToggleControl
                        label={__('Display Title', 'murdeni-blocks')}
                        checked={displayTitle}
                        onChange={() => setAttributes({ displayTitle: !displayTitle })}
                    />

                    <ToggleControl
                        label={__('Display Category', 'murdeni-blocks')}
                        checked={displayCategory}
                        onChange={() => setAttributes({ displayCategory: !displayCategory })}
                    />

                    {displayTitle && (
                        <RangeControl
                            label={__('Title Font Size (px)', 'murdeni-blocks')}
                            value={titleFontSize}
                            onChange={(value) => setAttributes({ titleFontSize: value })}
                            min={12}
                            max={36}
                        />
                    )}

                    {displayCategory && (
                        <RangeControl
                            label={__('Category Font Size (px)', 'murdeni-blocks')}
                            value={metaFontSize}
                            onChange={(value) => setAttributes({ metaFontSize: value })}
                            min={10}
                            max={24}
                        />
                    )}

                    <SelectControl
                        label={__('Hover Effect', 'murdeni-blocks')}
                        value={hoverEffect}
                        options={[
                            { label: __('Zoom', 'murdeni-blocks'), value: 'zoom' },
                            { label: __('Fade', 'murdeni-blocks'), value: 'fade' },
                            { label: __('Slide Up', 'murdeni-blocks'), value: 'slide-up' },
                            { label: __('None', 'murdeni-blocks'), value: 'none' },
                        ]}
                        onChange={(value) => setAttributes({ hoverEffect: value })}
                    />

                    <div className="murdeni-color-settings">
                        <p>{__('Overlay Color', 'murdeni-blocks')}</p>
                        <ColorPicker
                            color={overlayColor}
                            onChange={(value) => setAttributes({ overlayColor: value })}
                            enableAlpha
                        />
                    </div>

                    <div className="murdeni-color-settings">
                        <p>{__('Overlay Text Color', 'murdeni-blocks')}</p>
                        <ColorPicker
                            color={overlayTextColor}
                            onChange={(value) => setAttributes({ overlayTextColor: value })}
                        />
                    </div>

                    <RangeControl
                        label={__('Border Radius (px)', 'murdeni-blocks')}
                        value={borderRadius}
                        onChange={(value) => setAttributes({ borderRadius: value })}
                        min={0}
                        max={50}
                    />

                    <SelectControl
                        label={__('Overlay Content Position', 'murdeni-blocks')}
                        value={overlayContentPosition}
                        options={[
                            { label: __('Top', 'murdeni-blocks'), value: 'top' },
                            { label: __('Center', 'murdeni-blocks'), value: 'center' },
                            { label: __('Bottom', 'murdeni-blocks'), value: 'bottom' },
                        ]}
                        onChange={(value) => setAttributes({ overlayContentPosition: value })}
                    />
                </PanelBody>
            </InspectorControls>

            <div className="murdeni-portfolio-grid-editor">
                <ServerSideRender
                    block="murdeni/portfolio-grid"
                    attributes={attributes}
                />
            </div>
        </div>
    );
}
