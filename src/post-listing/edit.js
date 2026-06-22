/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import {
    PanelBody,
    SelectControl,
    RangeControl,
    ToggleControl,
    TextControl,
    Spinner,
    Placeholder,
    Button,
    RadioControl,
} from '@wordpress/components';
import {
    InspectorControls,
    useBlockProps,
} from '@wordpress/block-editor';
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies
 */
import './editor.scss';
import ServerSideRender from '@wordpress/server-side-render';

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
        displayFeaturedImage,
        displayTitle,
        displayExcerpt,
        excerptLength,
        displayReadMore,
        readMoreText,
        displayHeader,
        headerTitle,
        displayViewAll,
        viewAllText,
        viewAllUrl,
        displayDate,
        displayAuthor,
        displayCategory,
        imageSize,
        aspectRatio,
        listGap,
        cardStyle,
        titleFontSize,
        contentFontSize,
        metaFontSize,
        alignment,
        imageWidth,
    } = attributes;

    // State for available post types, categories, and tags
    const [availablePostTypes, setAvailablePostTypes] = useState([]);
    const [availableCategories, setAvailableCategories] = useState([]);
    const [availableTags, setAvailableTags] = useState([]);
    const [availableTaxonomies, setAvailableTaxonomies] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState([]);

    // Fetch post types on component mount
    useEffect(() => {
        fetchPostTypes();
    }, []);
    
    // Fetch post types from API
    const fetchPostTypes = async () => {
        try {
            setIsLoading(true);
            const response = await apiFetch({ path: '/wp/v2/types' });
            const postTypeOptions = Object.keys(response)
                .filter((type) => response[type].viewable)
                .map((type) => ({
                    label: response[type].name,
                    value: type,
                }));
            setAvailablePostTypes(postTypeOptions);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching post types:', error);
            setIsLoading(false);
        }
    };

    // Fetch categories when post type is 'post'
    useEffect(() => {
        if (postType === 'post') {
            apiFetch({ path: '/wp/v2/categories?per_page=100' })
                .then((fetchedCategories) => {
                    const categoryOptions = fetchedCategories.map((category) => ({
                        label: category.name,
                        value: category.id,
                    }));
                    setAvailableCategories(categoryOptions);
                })
                .catch((error) => {
                    console.error('Error fetching categories:', error);
                });
        }
    }, [postType]);

    // Fetch tags when post type is 'post'
    useEffect(() => {
        if (postType === 'post') {
            apiFetch({ path: '/wp/v2/tags?per_page=100' })
                .then((fetchedTags) => {
                    const tagOptions = fetchedTags.map((tag) => ({
                        label: tag.name,
                        value: tag.id,
                    }));
                    setAvailableTags(tagOptions);
                })
                .catch((error) => {
                    console.error('Error fetching tags:', error);
                });
        }
    }, [postType]);

    // Fetch taxonomies for the selected post type
    useEffect(() => {
        if (postType && postType !== 'post') {
            apiFetch({ path: `/wp/v2/taxonomies?type=${postType}` })
                .then((fetchedTaxonomies) => {
                    const taxonomyData = {};
                    Object.keys(fetchedTaxonomies).forEach((taxonomySlug) => {
                        const taxonomy = fetchedTaxonomies[taxonomySlug];
                        if (taxonomy.visibility.show_ui) {
                            taxonomyData[taxonomySlug] = {
                                name: taxonomy.name,
                                restBase: taxonomy.rest_base,
                                terms: [],
                            };
                        }
                    });
                    setAvailableTaxonomies(taxonomyData);
                    
                    // Fetch terms for each taxonomy
                    Object.keys(taxonomyData).forEach((taxonomySlug) => {
                        const taxonomy = taxonomyData[taxonomySlug];
                        apiFetch({ path: `/wp/v2/${taxonomy.restBase}?per_page=100` })
                            .then((terms) => {
                                const termOptions = terms.map((term) => ({
                                    label: term.name,
                                    value: term.id,
                                }));
                                taxonomyData[taxonomySlug].terms = termOptions;
                                setAvailableTaxonomies({ ...taxonomyData });
                            })
                            .catch((error) => {
                                console.error(`Error fetching terms for ${taxonomySlug}:`, error);
                            });
                    });
                })
                .catch((error) => {
                    console.error('Error fetching taxonomies:', error);
                });
        }
    }, [postType]);

    // Fetch posts for preview
    useEffect(() => {
        let path = `/wp/v2/${postType}?_embed&per_page=${postsToShow}&order=${order}&orderby=${orderBy}`;
        
        // Add category filter for posts
        if (postType === 'post' && categories.length > 0) {
            path += `&categories=${categories.join(',')}`;
        }
        
        // Add tag filter for posts
        if (postType === 'post' && tags.length > 0) {
            path += `&tags=${tags.join(',')}`;
        }
        
        // Add taxonomy filters for custom post types
        if (postType !== 'post' && Object.keys(taxonomies).length > 0) {
            Object.keys(taxonomies).forEach((taxonomySlug) => {
                const selectedTerms = taxonomies[taxonomySlug];
                if (selectedTerms && selectedTerms.length > 0) {
                    path += `&${taxonomySlug}=${selectedTerms.join(',')}`;
                }
            });
        }
        
        apiFetch({ path })
            .then((fetchedPosts) => {
                setPosts(fetchedPosts);
            })
            .catch((error) => {
                console.error('Error fetching posts:', error);
            });
    }, [postType, postsToShow, order, orderBy, categories, tags, taxonomies]);

    // Get block props
    const blockProps = useBlockProps({
        className: `murdeni-post-listing align-${alignment} style-${cardStyle}`,
    });

    // Truncate excerpt
    const truncateExcerpt = (text, length) => {
        if (!text) return '';
        text = text.replace(/<\/?[^>]+(>|$)/g, ''); // Remove HTML tags
        if (text.length <= length) return text;
        return text.substring(0, length) + '...';
    };

    // Get image aspect ratio style
    const getAspectRatioStyle = () => {
        const [width, height] = aspectRatio.split(':');
        return {
            paddingBottom: `${(height / width) * 100}%`,
        };
    };

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Post Settings', 'murdeni-blocks')}>
                    <SelectControl
                        label={__('Post Type', 'murdeni-blocks')}
                        value={postType}
                        options={availablePostTypes}
                        onChange={(value) => setAttributes({ postType: value })}
                    />
                    <RangeControl
                        label={__('Number of Posts', 'murdeni-blocks')}
                        value={postsToShow}
                        onChange={(value) => setAttributes({ postsToShow: value })}
                        min={1}
                        max={20}
                    />
                    <SelectControl
                        label={__('Order By', 'murdeni-blocks')}
                        value={orderBy}
                        options={[
                            { label: __('Date', 'murdeni-blocks'), value: 'date' },
                            { label: __('Title', 'murdeni-blocks'), value: 'title' },
                            { label: __('Modified', 'murdeni-blocks'), value: 'modified' },
                            { label: __('Menu Order', 'murdeni-blocks'), value: 'menu_order' },
                            { label: __('Random', 'murdeni-blocks'), value: 'rand' },
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
                    
                    {postType === 'post' && availableCategories.length > 0 && (
                        <SelectControl
                            label={__('Categories', 'murdeni-blocks')}
                            value={categories}
                            options={[
                                { label: __('All Categories', 'murdeni-blocks'), value: '' },
                                ...availableCategories,
                            ]}
                            onChange={(value) => {
                                const selectedCategories = value ? [parseInt(value)] : [];
                                setAttributes({ categories: selectedCategories });
                            }}
                        />
                    )}
                    
                    {postType === 'post' && availableTags.length > 0 && (
                        <SelectControl
                            label={__('Tags', 'murdeni-blocks')}
                            value={tags[0] || ''}
                            options={[
                                { label: __('All Tags', 'murdeni-blocks'), value: '' },
                                ...availableTags,
                            ]}
                            onChange={(value) => {
                                const selectedTags = value ? [parseInt(value)] : [];
                                setAttributes({ tags: selectedTags });
                            }}
                        />
                    )}
                </PanelBody>
                
                <PanelBody title={__('Header Settings', 'murdeni-blocks')}>
                    <ToggleControl
                        label={__('Display Header', 'murdeni-blocks')}
                        checked={displayHeader}
                        onChange={(value) => setAttributes({ displayHeader: value })}
                    />
                    {displayHeader && (
                        <>
                            <TextControl
                                label={__('Header Title', 'murdeni-blocks')}
                                value={headerTitle}
                                onChange={(value) => setAttributes({ headerTitle: value })}
                            />
                            <ToggleControl
                                label={__('Display View All Link', 'murdeni-blocks')}
                                checked={displayViewAll}
                                onChange={(value) => setAttributes({ displayViewAll: value })}
                            />
                            {displayViewAll && (
                                <>
                                    <TextControl
                                        label={__('View All Text', 'murdeni-blocks')}
                                        value={viewAllText}
                                        onChange={(value) => setAttributes({ viewAllText: value })}
                                    />
                                    <TextControl
                                        label={__('View All URL', 'murdeni-blocks')}
                                        value={viewAllUrl}
                                        onChange={(value) => setAttributes({ viewAllUrl: value })}
                                        placeholder="https://example.com/posts"
                                    />
                                </>
                            )}
                        </>
                    )}
                </PanelBody>
                
                <PanelBody title={__('Display Settings', 'murdeni-blocks')}>
                    <ToggleControl
                        label={__('Display Featured Image', 'murdeni-blocks')}
                        checked={displayFeaturedImage}
                        onChange={() => setAttributes({ displayFeaturedImage: !displayFeaturedImage })}
                    />
                    
                    {displayFeaturedImage && (
                        <>
                            <SelectControl
                                label={__('Image Size', 'murdeni-blocks')}
                                value={imageSize}
                                options={[
                                    { label: __('Thumbnail', 'murdeni-blocks'), value: 'thumbnail' },
                                    { label: __('Medium', 'murdeni-blocks'), value: 'medium' },
                                    { label: __('Large', 'murdeni-blocks'), value: 'large' },
                                    { label: __('Full', 'murdeni-blocks'), value: 'full' },
                                ]}
                                onChange={(value) => setAttributes({ imageSize: value })}
                            />
                            
                            <SelectControl
                                label={__('Aspect Ratio', 'murdeni-blocks')}
                                value={aspectRatio}
                                options={[
                                    { label: __('1:1 (Square)', 'murdeni-blocks'), value: '1:1' },
                                    { label: __('4:3', 'murdeni-blocks'), value: '4:3' },
                                    { label: __('16:9', 'murdeni-blocks'), value: '16:9' },
                                    { label: __('3:2', 'murdeni-blocks'), value: '3:2' },
                                ]}
                                onChange={(value) => setAttributes({ aspectRatio: value })}
                            />
                            
                            <RangeControl
                                label={__('Image Width (%)', 'murdeni-blocks')}
                                value={imageWidth}
                                onChange={(value) => setAttributes({ imageWidth: value })}
                                min={20}
                                max={50}
                            />
                        </>
                    )}
                    
                    <ToggleControl
                        label={__('Display Title', 'murdeni-blocks')}
                        checked={displayTitle}
                        onChange={() => setAttributes({ displayTitle: !displayTitle })}
                    />
                    
                    <ToggleControl
                        label={__('Display Date', 'murdeni-blocks')}
                        checked={displayDate}
                        onChange={() => setAttributes({ displayDate: !displayDate })}
                    />
                    
                    <ToggleControl
                        label={__('Display Author', 'murdeni-blocks')}
                        checked={displayAuthor}
                        onChange={() => setAttributes({ displayAuthor: !displayAuthor })}
                    />
                    
                    <ToggleControl
                        label={__('Display Category', 'murdeni-blocks')}
                        checked={displayCategory}
                        onChange={() => setAttributes({ displayCategory: !displayCategory })}
                    />
                    
                    <ToggleControl
                        label={__('Display Excerpt', 'murdeni-blocks')}
                        checked={displayExcerpt}
                        onChange={() => setAttributes({ displayExcerpt: !displayExcerpt })}
                    />
                    
                    {displayExcerpt && (
                        <RangeControl
                            label={__('Excerpt Length', 'murdeni-blocks')}
                            value={excerptLength}
                            onChange={(value) => setAttributes({ excerptLength: value })}
                            min={10}
                            max={100}
                        />
                    )}
                    
                    <ToggleControl
                        label={__('Display Read More Button', 'murdeni-blocks')}
                        checked={displayReadMore}
                        onChange={() => setAttributes({ displayReadMore: !displayReadMore })}
                    />
                    
                    {displayReadMore && (
                        <TextControl
                            label={__('Read More Text', 'murdeni-blocks')}
                            value={readMoreText}
                            onChange={(value) => setAttributes({ readMoreText: value })}
                        />
                    )}
                </PanelBody>
                
                <PanelBody title={__('Style Settings', 'murdeni-blocks')}>
                    <SelectControl
                        label={__('Card Style', 'murdeni-blocks')}
                        value={cardStyle}
                        options={[
                            { label: __('Bordered', 'murdeni-blocks'), value: 'bordered' },
                            { label: __('Boxed', 'murdeni-blocks'), value: 'boxed' },
                            { label: __('Plain', 'murdeni-blocks'), value: 'plain' },
                        ]}
                        onChange={(value) => setAttributes({ cardStyle: value })}
                    />
                    
                    <SelectControl
                        label={__('Content Alignment', 'murdeni-blocks')}
                        value={alignment}
                        options={[
                            { label: __('Left', 'murdeni-blocks'), value: 'left' },
                            { label: __('Center', 'murdeni-blocks'), value: 'center' },
                            { label: __('Right', 'murdeni-blocks'), value: 'right' },
                        ]}
                        onChange={(value) => setAttributes({ alignment: value })}
                    />
                    
                    <RangeControl
                        label={__('Space Between Items (px)', 'murdeni-blocks')}
                        value={listGap}
                        onChange={(value) => setAttributes({ listGap: value })}
                        min={0}
                        max={60}
                    />
                    
                    <RangeControl
                        label={__('Title Font Size (px)', 'murdeni-blocks')}
                        value={titleFontSize}
                        onChange={(value) => setAttributes({ titleFontSize: value })}
                        min={12}
                        max={36}
                    />
                    
                    <RangeControl
                        label={__('Content Font Size (px)', 'murdeni-blocks')}
                        value={contentFontSize}
                        onChange={(value) => setAttributes({ contentFontSize: value })}
                        min={10}
                        max={24}
                    />
                    
                    <RangeControl
                        label={__('Meta Font Size (px)', 'murdeni-blocks')}
                        value={metaFontSize}
                        onChange={(value) => setAttributes({ metaFontSize: value })}
                        min={8}
                        max={18}
                    />
                </PanelBody>
            </InspectorControls>
            
            <div {...blockProps}>
                <ServerSideRender
                    block="murdeni/post-listing"
                    attributes={attributes}
                />
            </div>
        </>
    );
}


