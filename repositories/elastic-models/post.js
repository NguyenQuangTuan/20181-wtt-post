post = {
	"settings": {
		"index": {
			"number_of_shards": 1,
			"number_of_replicas": 1
		},
		"analysis": {
			"analyzer": {
				"autocomplete": {
					"tokenizer": "prd_edge_ngram",
					"filter": [
						"standard",
						"lowercase",
						"prd_stop_words"
					]
				},
				"search": {
					"tokenizer": "standard",
					"filter": [
						"standard",
						"lowercase",
						"prd_stop_words"

					]
				},
				"lowercase": {
					"tokenizer": "lowercase"
				},
				"filter_html": {
					"tokenizer": "standard",
					"char_filter": [
						"html_strip"
					],
					"filter": [
						"lowercase"
					]
				}
			},
			"tokenizer": {
				"prd_edge_ngram": {
					"type": "edge_ngram",
					"min_gram": 1,
					"max_gram": 10,
					"token_chars": [
						"letter",
						"digit",
						"punctuation"
					]
				}
			},
			"filter": {
				"prd_stop_words": {
					"type": "stop",
					"stopwords": "_english_"
				}
			}
		}
	},
	"mappings": {
		"_doc": {
			"properties": {
				"post_id": {
					"type": "keyword"
				},
				"title": {
					"type": "text",
					"analyzer": "search",
					"fields": {
						"autocomplete": {
							"type": "text",
							"analyzer": "autocomplete"
						},
						"keyword": {
							"type": "keyword"
						}
					}
				},
				"content": {
					"type": "text",
					"analyzer": "filter_html"
				},
				"short_content": {
					"type": "keyword"
				},
				"user_id": {
					"type": "keyword"
				},
				"total_like": {
					"type": "long"
				},
				"tags": {
					"type": "text",
					"analyzer": "lowercase",
					"fields": {
						"keyword": {
							"type": "keyword"
						}
					}
				},
				"created_at": {
					"type": "date"
				},
				"updated_at": {
					"type": "date"
				}
			}
		}
	}
}
