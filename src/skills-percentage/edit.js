/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
    InspectorControls,
    useBlockProps,
} from '@wordpress/block-editor';
import {
    PanelBody,
    RangeControl,
    ToggleControl,
    ColorPicker,
    Button,
    TextControl,
    Flex,
    FlexItem,
} from '@wordpress/components';
import { useState } from '@wordpress/element';

/**
 * Edit function for Skills Percentage block
 */
export default function Edit({ attributes, setAttributes }) {
    const {
        skills,
        barHeight,
        barColor,
        barBackgroundColor,
        textColor,
        fontSize,
        barBorderRadius,
        showPercentage,
        animateOnScroll,
        spacing,
    } = attributes;

    const [selectedSkill, setSelectedSkill] = useState(null);

    // Block props
    const blockProps = useBlockProps({
        className: 'murdeni-skills-percentage',
    });

    // Add a new skill
    const addSkill = () => {
        const newSkill = {
            id: `skill-${Date.now()}`,
            name: __('New Skill', 'murdeni-blocks'),
            percentage: 80,
        };

        setAttributes({
            skills: [...skills, newSkill],
        });
    };

    // Remove a skill
    const removeSkill = (skillId) => {
        setAttributes({
            skills: skills.filter((skill) => skill.id !== skillId),
        });
        
        if (selectedSkill === skillId) {
            setSelectedSkill(null);
        }
    };

    // Update skill name
    const updateSkillName = (skillId, name) => {
        setAttributes({
            skills: skills.map((skill) =>
                skill.id === skillId ? { ...skill, name } : skill
            ),
        });
    };

    // Update skill percentage
    const updateSkillPercentage = (skillId, percentage) => {
        setAttributes({
            skills: skills.map((skill) =>
                skill.id === skillId ? { ...skill, percentage } : skill
            ),
        });
    };

    // Move skill up
    const moveSkillUp = (index) => {
        if (index === 0) return;
        
        const newSkills = [...skills];
        const temp = newSkills[index];
        newSkills[index] = newSkills[index - 1];
        newSkills[index - 1] = temp;
        
        setAttributes({ skills: newSkills });
    };

    // Move skill down
    const moveSkillDown = (index) => {
        if (index === skills.length - 1) return;
        
        const newSkills = [...skills];
        const temp = newSkills[index];
        newSkills[index] = newSkills[index + 1];
        newSkills[index + 1] = temp;
        
        setAttributes({ skills: newSkills });
    };

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Skills Settings', 'murdeni-blocks')}>
                    {skills.map((skill, index) => (
                        <PanelBody
                            key={skill.id}
                            title={skill.name || __('Skill', 'murdeni-blocks')}
                            initialOpen={selectedSkill === skill.id}
                            onToggle={() => setSelectedSkill(selectedSkill === skill.id ? null : skill.id)}
                        >
                            <TextControl
                                label={__('Skill Name', 'murdeni-blocks')}
                                value={skill.name}
                                onChange={(value) => updateSkillName(skill.id, value)}
                            />
                            <RangeControl
                                label={__('Percentage', 'murdeni-blocks')}
                                value={skill.percentage}
                                onChange={(value) => updateSkillPercentage(skill.id, value)}
                                min={0}
                                max={100}
                            />
                            <Flex>
                                <FlexItem>
                                    <Button
                                        isSecondary
                                        isSmall
                                        onClick={() => moveSkillUp(index)}
                                        disabled={index === 0}
                                    >
                                        {__('Move Up', 'murdeni-blocks')}
                                    </Button>
                                </FlexItem>
                                <FlexItem>
                                    <Button
                                        isSecondary
                                        isSmall
                                        onClick={() => moveSkillDown(index)}
                                        disabled={index === skills.length - 1}
                                    >
                                        {__('Move Down', 'murdeni-blocks')}
                                    </Button>
                                </FlexItem>
                                <FlexItem>
                                    <Button
                                        isDestructive
                                        isSmall
                                        onClick={() => removeSkill(skill.id)}
                                    >
                                        {__('Remove', 'murdeni-blocks')}
                                    </Button>
                                </FlexItem>
                            </Flex>
                        </PanelBody>
                    ))}
                    <Button
                        isPrimary
                        onClick={addSkill}
                        style={{ marginTop: '10px', width: '100%' }}
                    >
                        {__('Add Skill', 'murdeni-blocks')}
                    </Button>
                </PanelBody>
                
                <PanelBody title={__('Appearance', 'murdeni-blocks')}>
                    <RangeControl
                        label={__('Bar Height (px)', 'murdeni-blocks')}
                        value={barHeight}
                        onChange={(value) => setAttributes({ barHeight: value })}
                        min={5}
                        max={50}
                    />
                    <RangeControl
                        label={__('Font Size (px)', 'murdeni-blocks')}
                        value={fontSize}
                        onChange={(value) => setAttributes({ fontSize: value })}
                        min={10}
                        max={30}
                    />
                    <RangeControl
                        label={__('Bar Border Radius (px)', 'murdeni-blocks')}
                        value={barBorderRadius}
                        onChange={(value) => setAttributes({ barBorderRadius: value })}
                        min={0}
                        max={25}
                    />
                    <RangeControl
                        label={__('Spacing Between Bars (px)', 'murdeni-blocks')}
                        value={spacing}
                        onChange={(value) => setAttributes({ spacing: value })}
                        min={5}
                        max={50}
                    />
                    <ToggleControl
                        label={__('Show Percentage', 'murdeni-blocks')}
                        checked={showPercentage}
                        onChange={() => setAttributes({ showPercentage: !showPercentage })}
                    />
                    <ToggleControl
                        label={__('Animate on Scroll', 'murdeni-blocks')}
                        checked={animateOnScroll}
                        onChange={() => setAttributes({ animateOnScroll: !animateOnScroll })}
                    />
                    <p>{__('Bar Color', 'murdeni-blocks')}</p>
                    <ColorPicker
                        color={barColor}
                        onChange={(value) => setAttributes({ barColor: value })}
                        enableAlpha
                    />
                    <p>{__('Bar Background Color', 'murdeni-blocks')}</p>
                    <ColorPicker
                        color={barBackgroundColor}
                        onChange={(value) => setAttributes({ barBackgroundColor: value })}
                        enableAlpha
                    />
                    <p>{__('Text Color', 'murdeni-blocks')}</p>
                    <ColorPicker
                        color={textColor}
                        onChange={(value) => setAttributes({ textColor: value })}
                        enableAlpha
                    />
                </PanelBody>
            </InspectorControls>
            
            <div {...blockProps}>
                <div 
                    className="murdeni-skills-percentage-container"
                    style={{ 
                        '--murdeni-skills-spacing': `${spacing}px`,
                        '--murdeni-skills-font-size': `${fontSize}px`,
                        '--murdeni-skills-text-color': textColor
                    }}
                >
                    {skills.map((skill) => (
                        <div key={skill.id} className="murdeni-skills-percentage-item">
                            <div className="murdeni-skills-percentage-header">
                                <span className="murdeni-skills-percentage-name">{skill.name}</span>
                                {showPercentage && (
                                    <span className="murdeni-skills-percentage-value">{skill.percentage}%</span>
                                )}
                            </div>
                            <div 
                                className="murdeni-skills-percentage-bar-bg"
                                style={{ 
                                    height: `${barHeight}px`,
                                    backgroundColor: barBackgroundColor,
                                    borderRadius: `${barBorderRadius}px`
                                }}
                            >
                                <div 
                                    className="murdeni-skills-percentage-bar"
                                    style={{ 
                                        width: `${skill.percentage}%`,
                                        height: `${barHeight}px`,
                                        backgroundColor: barColor,
                                        borderRadius: `${barBorderRadius}px`
                                    }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
