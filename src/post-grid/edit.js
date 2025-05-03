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
    RadioControl,
    __experimentalNumberControl as NumberControl,
} from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import ServerSideRender from '@wordpress/server-side-render';

/**
 * Internal dependencies
 */
import { postGrid as icon } from './icons';

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
        layout,
        columns,
        displayFeaturedImage,
        displayTitle,
        displayExcerpt,
        excerptLength,
        displayReadMore,
        readMoreText,
        displayDate,
        displayAuthor,
        displayCategory,
        imageSize,
        aspectRatio,
        gridGap,
        cardStyle,
        titleFontSize,
        contentFontSize,
        metaFontSize,
        alignment,
    } = attributes;

    // State for post types, taxonomies, and terms
    const [postTypes, setPostTypes] = useState([]);
    const [availableTaxonomies, setAvailableTaxonomies] = useState([]);
    const [availableTerms, setAvailableTerms] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [imageSizes, setImageSizes] = useState([
        { label: __('Thumbnail', 'murdeni-post-grid'), value: 'thumbnail' },
        { label: __('Medium', 'murdeni-post-grid'), value: 'medium' },
        { label: __('Large', 'murdeni-post-grid'), value: 'large' },
        { label: __('Full', 'murdeni-post-grid'), value: 'full' },
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
                    label={__('Murdeni Post Grid', 'murdeni-blocks')}
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
                <PanelBody title={__('Content Settings', 'murdeni-post-grid')} initialOpen={true}>
                    <SelectControl
                        label={__('Post Type', 'murdeni-post-grid')}
                        value={postType}
                        options={postTypes}
                        onChange={(value) => setAttributes({ postType: value })}
                    />

                    <RangeControl
                        label={__('Number of Posts', 'murdeni-post-grid')}
                        value={postsToShow}
                        onChange={(value) => setAttributes({ postsToShow: value })}
                        min={1}
                        max={50}
                    />

                    <SelectControl
                        label={__('Order By', 'murdeni-post-grid')}
                        value={orderBy}
                        options={[
                            { label: __('Date', 'murdeni-post-grid'), value: 'date' },
                            { label: __('Title', 'murdeni-post-grid'), value: 'title' },
                            { label: __('Menu Order', 'murdeni-post-grid'), value: 'menu_order' },
                            { label: __('Random', 'murdeni-post-grid'), value: 'rand' },
                            { label: __('Comment Count', 'murdeni-post-grid'), value: 'comment_count' },
                        ]}
                        onChange={(value) => setAttributes({ orderBy: value })}
                    />

                    <SelectControl
                        label={__('Order', 'murdeni-post-grid')}
                        value={order}
                        options={[
                            { label: __('Descending', 'murdeni-post-grid'), value: 'desc' },
                            { label: __('Ascending', 'murdeni-post-grid'), value: 'asc' },
                        ]}
                        onChange={(value) => setAttributes({ order: value })}
                    />

                    {/* Taxonomy Filters */}
                    {availableTaxonomies.map((taxonomy) => {
                        const terms = availableTerms[taxonomy.value] || [];
                        
                        if (!terms.length) return null;
                        
                        // Get selected terms for this taxonomy
                        const selectedTerms = taxonomies[taxonomy.value] || [];
                        
                        return (
                            <div key={taxonomy.value} className="murdeni-post-grid-taxonomy-control">
                                <p>{taxonomy.label}</p>
                                <select
                                    multiple
                                    value={selectedTerms}
                                    onChange={(e) => {
                                        const selectedOptions = Array.from(e.target.selectedOptions, option => parseInt(option.value));
                                        handleTermSelection(taxonomy.value, selectedOptions);
                                    }}
                                    style={{ width: '100%', minHeight: '100px' }}
                                >
                                    {terms.map((term) => (
                                        <option key={term.value} value={term.value}>
                                            {term.label}
                                        </option>
                                    ))}
                                </select>
                                <p className="components-base-control__help">
                                    {__('Hold Ctrl/Cmd to select multiple', 'murdeni-post-grid')}
                                </p>
                            </div>
                        );
                    })}
                </PanelBody>

                {/* Layout Settings */}
                <PanelBody title={__('Layout Settings', 'murdeni-post-grid')} initialOpen={false}>
                    <SelectControl
                        label={__('Layout', 'murdeni-post-grid')}
                        value={layout}
                        options={[
                            { label: __('Grid', 'murdeni-post-grid'), value: 'grid' },
                            { label: __('List', 'murdeni-post-grid'), value: 'list' },
                            { label: __('Masonry', 'murdeni-post-grid'), value: 'masonry' },
                        ]}
                        onChange={(value) => setAttributes({ layout: value })}
                    />

                    {layout !== 'list' && (
                        <RangeControl
                            label={__('Columns', 'murdeni-post-grid')}
                            value={columns}
                            onChange={(value) => setAttributes({ columns: value })}
                            min={1}
                            max={6}
                        />
                    )}

                    <RangeControl
                        label={__('Grid Gap (px)', 'murdeni-post-grid')}
                        value={gridGap}
                        onChange={(value) => setAttributes({ gridGap: value })}
                        min={0}
                        max={50}
                    />

                    <SelectControl
                        label={__('Card Style', 'murdeni-post-grid')}
                        value={cardStyle}
                        options={[
                            { label: __('Bordered', 'murdeni-post-grid'), value: 'bordered' },
                            { label: __('Shadowed', 'murdeni-post-grid'), value: 'shadowed' },
                            { label: __('Plain', 'murdeni-post-grid'), value: 'plain' },
                        ]}
                        onChange={(value) => setAttributes({ cardStyle: value })}
                    />

                    <SelectControl
                        label={__('Text Alignment', 'murdeni-post-grid')}
                        value={alignment}
                        options={[
                            { label: __('Left', 'murdeni-post-grid'), value: 'left' },
                            { label: __('Center', 'murdeni-post-grid'), value: 'center' },
                            { label: __('Right', 'murdeni-post-grid'), value: 'right' },
                        ]}
                        onChange={(value) => setAttributes({ alignment: value })}
                    />
                </PanelBody>

                {/* Image Settings */}
                <PanelBody title={__('Image Settings', 'murdeni-post-grid')} initialOpen={false}>
                    <ToggleControl
                        label={__('Display Featured Image', 'murdeni-post-grid')}
                        checked={displayFeaturedImage}
                        onChange={() => setAttributes({ displayFeaturedImage: !displayFeaturedImage })}
                    />

                    {displayFeaturedImage && (
                        <>
                            <SelectControl
                                label={__('Image Size', 'murdeni-post-grid')}
                                value={imageSize}
                                options={imageSizes}
                                onChange={(value) => setAttributes({ imageSize: value })}
                            />

                            <SelectControl
                                label={__('Aspect Ratio', 'murdeni-post-grid')}
                                value={aspectRatio}
                                options={[
                                    { label: __('16:9', 'murdeni-post-grid'), value: '16:9' },
                                    { label: __('4:3', 'murdeni-post-grid'), value: '4:3' },
                                    { label: __('1:1 (Square)', 'murdeni-post-grid'), value: '1:1' },
                                    { label: __('3:4', 'murdeni-post-grid'), value: '3:4' },
                                    { label: __('9:16', 'murdeni-post-grid'), value: '9:16' },
                                ]}
                                onChange={(value) => setAttributes({ aspectRatio: value })}
                            />
                        </>
                    )}
                </PanelBody>

                {/* Content Display Settings */}
                <PanelBody title={__('Content Display', 'murdeni-post-grid')} initialOpen={false}>
                    <ToggleControl
                        label={__('Display Title', 'murdeni-post-grid')}
                        checked={displayTitle}
                        onChange={() => setAttributes({ displayTitle: !displayTitle })}
                    />

                    {displayTitle && (
                        <NumberControl
                            label={__('Title Font Size (px)', 'murdeni-post-grid')}
                            value={titleFontSize}
                            onChange={(value) => setAttributes({ titleFontSize: parseInt(value) })}
                            min={10}
                            max={36}
                        />
                    )}

                    <ToggleControl
                        label={__('Display Excerpt', 'murdeni-post-grid')}
                        checked={displayExcerpt}
                        onChange={() => setAttributes({ displayExcerpt: !displayExcerpt })}
                    />

                    {displayExcerpt && (
                        <>
                            <RangeControl
                                label={__('Excerpt Length (words)', 'murdeni-post-grid')}
                                value={excerptLength}
                                onChange={(value) => setAttributes({ excerptLength: value })}
                                min={5}
                                max={100}
                            />

                            <NumberControl
                                label={__('Content Font Size (px)', 'murdeni-post-grid')}
                                value={contentFontSize}
                                onChange={(value) => setAttributes({ contentFontSize: parseInt(value) })}
                                min={10}
                                max={24}
                            />
                        </>
                    )}

                    <ToggleControl
                        label={__('Display Read More Button', 'murdeni-post-grid')}
                        checked={displayReadMore}
                        onChange={() => setAttributes({ displayReadMore: !displayReadMore })}
                    />

                    {displayReadMore && (
                        <TextControl
                            label={__('Read More Text', 'murdeni-post-grid')}
                            value={readMoreText}
                            onChange={(value) => setAttributes({ readMoreText: value })}
                        />
                    )}
                </PanelBody>

                {/* Meta Display Settings */}
                <PanelBody title={__('Meta Display', 'murdeni-post-grid')} initialOpen={false}>
                    <ToggleControl
                        label={__('Display Date', 'murdeni-post-grid')}
                        checked={displayDate}
                        onChange={() => setAttributes({ displayDate: !displayDate })}
                    />

                    <ToggleControl
                        label={__('Display Author', 'murdeni-post-grid')}
                        checked={displayAuthor}
                        onChange={() => setAttributes({ displayAuthor: !displayAuthor })}
                    />

                    <ToggleControl
                        label={__('Display Category', 'murdeni-post-grid')}
                        checked={displayCategory}
                        onChange={() => setAttributes({ displayCategory: !displayCategory })}
                    />

                    {(displayDate || displayAuthor || displayCategory) && (
                        <NumberControl
                            label={__('Meta Font Size (px)', 'murdeni-post-grid')}
                            value={metaFontSize}
                            onChange={(value) => setAttributes({ metaFontSize: parseInt(value) })}
                            min={10}
                            max={18}
                        />
                    )}
                </PanelBody>
            </InspectorControls>

            <ServerSideRender
                block="murdeni/post-grid"
                attributes={attributes}
                EmptyResponsePlaceholder={() => (
                    <Placeholder
                        icon={icon}
                        label={__('Murdeni Post Grid', 'murdeni-post-grid')}
                    >
                        {__('No posts found. Try adjusting your filter settings.', 'murdeni-post-grid')}
                    </Placeholder>
                )}
            />
        </div>
    );
}
