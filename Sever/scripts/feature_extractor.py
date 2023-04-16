import url_features as urlfe
import external_features as trdfe
import pandas as pd 
import urllib.parse
import tldextract
import requests
import json
import csv
import os
import re
from urllib.parse import urlparse
import pickle
def words_raw_extraction(domain, subdomain, path):
        w_domain = re.split("\-|\.|\/|\?|\=|\@|\&|\%|\:|\_", domain.lower())
        w_subdomain = re.split("\-|\.|\/|\?|\=|\@|\&|\%|\:|\_", subdomain.lower())   
        w_path = re.split("\-|\.|\/|\?|\=|\@|\&|\%|\:|\_", path.lower())
        raw_words = w_domain + w_path + w_subdomain
        w_host = w_domain + w_subdomain
        raw_words = list(filter(None,raw_words))
        return raw_words, list(filter(None,w_host)), list(filter(None,w_path))
def get_domain(url):
    o = urllib.parse.urlsplit(url)
    return o.hostname, tldextract.extract(url).domain, o.path
def is_URL_accessible(url):
    #iurl = url
    #parsed = urlparse(url)
    #url = parsed.scheme+'://'+parsed.netloc
    page = None
    try:
        page = requests.get(url, timeout=5)   
    except:
        parsed = urlparse(url)
        url = parsed.scheme+'://'+parsed.netloc
        if not parsed.netloc.startswith('www'):
            url = parsed.scheme+'://www.'+parsed.netloc
            try:
                page = requests.get(url, timeout=5)
            except:
                page = None
                pass
        # if not parsed.netloc.startswith('www'):
        #     url = parsed.scheme+'://www.'+parsed.netloc
        #     #iurl = iurl.replace('https://', 'https://www.')
        #     try:
        #         page = requests.get(url)
        #     except:        
        #         # url = 'http://'+parsed.netloc
        #         # iurl = iurl.replace('https://', 'http://')
        #         # try:
        #         #     page = requests.get(url) 
        #         # except:
        #         #     if not parsed.netloc.startswith('www'):
        #         #         url = parsed.scheme+'://www.'+parsed.netloc
        #         #         iurl = iurl.replace('http://', 'http://www.')
        #         #         try:
        #         #             page = requests.get(url)
        #         #         except:
        #         #             pass
        #         pass 
    if page and page.status_code == 200 and page.content not in ["b''", "b' '"]:
        return True, url, page
    else:
        return False, None, None
def features_extraction(url):
  row = [0]*53
  state, iurl, page = is_URL_accessible(url)
  if state:
    content = page.content
    hostname, domain, path = get_domain(url)
    extracted_domain = tldextract.extract(url)
    domain = extracted_domain.domain+'.'+extracted_domain.suffix
    subdomain = extracted_domain.subdomain
    tmp = url[url.find(extracted_domain.suffix):len(url)]
    pth = tmp.partition("/")
    path = pth[1] + pth[2]
    words_raw, words_raw_host, words_raw_path= words_raw_extraction(extracted_domain.domain, subdomain, pth[2])
    tld = extracted_domain.suffix
    parsed = urlparse(url)
    scheme = parsed.scheme
    row = [urlfe.url_length(url),
               urlfe.url_length(hostname),
               urlfe.having_ip_address(url),
               urlfe.count_dots(url),
               urlfe.count_hyphens(url),
               urlfe.count_at(url),
               urlfe.count_exclamation(url),
               urlfe.count_and(url),
               urlfe.count_or(url),
               urlfe.count_equal(url),
               urlfe.count_underscore(url),
               urlfe.count_tilde(url),
               urlfe.count_percentage(url),
               urlfe.count_slash(url),
               urlfe.count_star(url),
               urlfe.count_colon(url),
               urlfe.count_comma(url),
               urlfe.count_semicolumn(url),
               urlfe.count_dollar(url),
               urlfe.count_space(url),
               
               urlfe.check_www(words_raw),
               urlfe.check_com(words_raw),
               urlfe.count_double_slash(url),
               urlfe.count_http_token(path),
               urlfe.https_token(scheme),
               
               urlfe.ratio_digits(url),
               urlfe.ratio_digits(hostname),
               urlfe.punycode(url),
               urlfe.port(url),
               urlfe.tld_in_path(tld, path),
               urlfe.tld_in_subdomain(tld, subdomain),
               urlfe.abnormal_subdomain(url),
               urlfe.count_subdomain(url),
               urlfe.prefix_suffix(url),
               urlfe.shortening_service(url),
               
               
               urlfe.path_extension(path),
               urlfe.length_word_raw(words_raw),
               urlfe.char_repeat(words_raw),
               urlfe.shortest_word_length(words_raw),
               urlfe.shortest_word_length(words_raw_host),
               urlfe.shortest_word_length(words_raw_path),
               urlfe.longest_word_length(words_raw),
               urlfe.longest_word_length(words_raw_host),
               urlfe.longest_word_length(words_raw_path),
               urlfe.average_word_length(words_raw),
               urlfe.average_word_length(words_raw_host),
               urlfe.average_word_length(words_raw_path),
  
               urlfe.phish_hints(url),  
               urlfe.domain_in_brand(extracted_domain.domain),
               urlfe.brand_in_path(extracted_domain.domain,subdomain),
               urlfe.brand_in_path(extracted_domain.domain,path),
               urlfe.suspecious_tld(tld),
               urlfe.statistical_report(url, domain)]
    
  return row